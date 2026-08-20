import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import xss from 'xss';
import { body, param, query, validationResult } from 'express-validator';
import { createClient } from '@supabase/supabase-js';
import { Groq } from 'groq-sdk';
import { SYSTEM_PROMPT } from '../src/config/chatbotSystemPrompt.js';

// ── Environment ────────────────────────────────────────────────────────
const supabaseUrl  = process.env.VITE_SUPABASE_URL;
const supabaseKey  = process.env.SUPABASE_SERVICE_KEY;
const JWT_SECRET   = process.env.JWT_SECRET;

if (!supabaseUrl || !supabaseKey || !JWT_SECRET) {
  console.error('[FATAL] Missing required environment variables (VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET). Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const app  = express();

// Fix for Vercel: Vercel strips the '/api' prefix when mounting api/index.js
// This middleware ensures our routes starting with '/api' still match.
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url === '/' ? '' : req.url);
  }
  next();
});

// ══════════════════════════════════════════════════════════════════════════════
// SECURITY HEADERS & MIDDLEWARE
// ══════════════════════════════════════════════════════════════════════════════
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

app.disable('x-powered-by');

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'https://devnexes.site',
  'https://www.devnexes.site'
];
// Allow any origin ending with vercel.app for preview deployments
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) return cb(null, true);
    cb(new Error('CORS: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS & RATE LIMITERS
// ══════════════════════════════════════════════════════════════════════════════
const sanitize = (str, maxLen = 500) =>
  xss((str || '').toString().trim(), { whiteList: {}, stripIgnoreTag: true }).slice(0, maxLen);

const isValidUsername = (u) => /^[a-zA-Z0-9_.\-]{3,50}$/.test(u);

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });
  next();
};

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  next();
};

const createRateLimiter = (maxRequests, windowMs) => {
  const requests = new Map();
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const timestamps = (requests.get(ip) || []).filter(t => now - t < windowMs);
    if (timestamps.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    timestamps.push(now);
    requests.set(ip, timestamps);
    next();
  };
};

const loginLimiter = createRateLimiter(10, 15 * 60 * 1000);   // Max 10 attempts / 15 min
const contactLimiter = createRateLimiter(5, 15 * 60 * 1000);   // Max 5 contact form submissions / 15 min

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES (MIGRATED TO SUPABASE)
// ══════════════════════════════════════════════════════════════════════════════

// ── Login ──────────────────────────────────────────────────────────────────────
app.post('/api/login', loginLimiter, [
  body('username').isString().trim().notEmpty().withMessage('Username is required').isLength({ max: 50 }),
  body('password').isString().notEmpty().withMessage('Password is required').isLength({ max: 100 }),
], validate, async (req, res) => {
  const username = sanitize(req.body.username, 50);
  const password = req.body.password;
  const INVALID = 'Invalid username or password';

  const { data: row, error } = await supabase.from('users').select('*').eq('username', username).single();
  
  if (error || !row || !bcrypt.compareSync(password, row.password)) {
    return res.status(401).json({ success: false, message: INVALID });
  }

  const token = jwt.sign(
    { id: row.id, username: row.username, role: row.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ success: true, token, user: { id: row.id, username: row.username, email: row.email, role: row.role } });
});

// ── Register ───────────────────────────────────────────────────────────────────
app.post('/api/register', loginLimiter, [
  body('username').isString().trim().notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], validate, async (req, res) => {
  const username = sanitize(req.body.username, 50);
  const email    = sanitize(req.body.email, 100);
  const password = req.body.password;

  if (!isValidUsername(username))
    return res.status(400).json({ error: 'Username may only contain letters, numbers, underscores, dots and hyphens (3–50 chars)' });

  const hash = bcrypt.hashSync(password, 12);
  const { data, error } = await supabase.from('users').insert({ username, password: hash, email }).select();
  
  if (error) return res.status(400).json({ error: 'Username or email already exists' });
  res.status(201).json({ success: true, id: data[0].id });
});

// ── Contact form ───────────────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, [
  body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('message').isString().trim().isLength({ min: 5, max: 2000 }).withMessage('Message must be 5–2000 characters'),
], validate, async (req, res) => {
  const name    = sanitize(req.body.name, 100);
  const email   = sanitize(req.body.email, 100);
  const message = sanitize(req.body.message, 2000);

  const { error } = await supabase.from('contact_requests').insert({ name, email, message });
  if (error) return res.status(500).json({ error: 'Server error' });
  res.status(201).json({ success: true });
});

// ── Public: Settings ───────────────────────────────────────────────────────────
app.get('/api/settings', async (req, res) => {
  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error) return res.status(500).json({ error: 'Could not load settings' });
  const settings = {};
  data.forEach(r => settings[r.key] = r.value);
  res.json(settings);
});

// ── Public: Social data ────────────────────────────────────────────────────────
app.get('/api/social-data', async (req, res) => {
  const { data } = await supabase.from('social_data').select('*').eq('id', 1).single();
  res.json(data || { transaction_volume: '9.9M', split_values: '3.5%', reviewed_by: '100k+', social_proof: '' });
});

// ── Public: Trusted clients ────────────────────────────────────────────────────
app.get('/api/trusted-clients', async (req, res) => {
  const { data, error } = await supabase.from('trusted_clients').select('*').order('ring').order('angle');
  if (error) return res.status(500).json({ error: 'Could not load clients' });
  res.json(data || []);
});

// ── Session heartbeat ──────────────────────────────────────────────────────────
app.post('/api/session/heartbeat', [
  body('visitor_id').isString().matches(/^[a-zA-Z0-9_-]{8,128}$/).withMessage('Invalid visitor_id'),
  body('username').optional().isString().isLength({ max: 50 }),
], validate, async (req, res) => {
  const visitor_id = sanitize(req.body.visitor_id, 128);
  const username   = sanitize(req.body.username || 'Anonymous', 50);

  const { data: row } = await supabase.from('site_visitors').select('id').eq('visitor_id', visitor_id).single();
  
  if (row) {
    await supabase.from('site_visitors').update({ username, last_seen: new Date().toISOString(), is_active: 1 }).eq('visitor_id', visitor_id);
  } else {
    await supabase.from('site_visitors').insert({ visitor_id, username });
  }
  res.json({ success: true });
});

// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED: SETTINGS (admin)
// ══════════════════════════════════════════════════════════════════════════════
app.put('/api/settings', auth, adminOnly, async (req, res) => {
  const ALLOWED_KEYS = new Set(['download_title', 'download_subtitle', 'download_desc', 'qr_url', 'mobile_wallpaper']);
  const updates = Object.fromEntries(
    Object.entries(req.body)
      .filter(([k]) => ALLOWED_KEYS.has(k))
      .map(([k, v]) => [k, sanitize(v)])
  );
  if (Object.keys(updates).length === 0) return res.json({ success: true });

  try {
    for (const [key, value] of Object.entries(updates)) {
      await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Could not save settings' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED: SOCIAL DATA (admin)
// ══════════════════════════════════════════════════════════════════════════════
app.put('/api/social-data', auth, adminOnly, async (req, res) => {
  const payload = {
    id: 1,
    transaction_volume: sanitize(req.body.transaction_volume),
    split_values:       sanitize(req.body.split_values),
    reviewed_by:        sanitize(req.body.reviewed_by),
    social_proof:       sanitize(req.body.social_proof, 1000),
  };
  const { error } = await supabase.from('social_data').upsert(payload);
  if (error) return res.status(500).json({ error: 'Could not update' });
  res.json({ success: true });
});

// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED: TRUSTED CLIENTS (admin)
// ══════════════════════════════════════════════════════════════════════════════
app.put('/api/trusted-clients', auth, adminOnly, async (req, res) => {
  const clients = req.body;
  if (!Array.isArray(clients) || clients.length > 50)
    return res.status(400).json({ error: 'Expected array (max 50)' });

  const VALID_RINGS = new Set(['outer', 'middle']);

  try {
    for (const client of clients) {
      const payload = {
        name:  sanitize(client.name, 100),
        role:  sanitize(client.role, 100),
        ring:  VALID_RINGS.has(client.ring) ? client.ring : 'outer',
        angle: Number.isInteger(Number(client.angle)) ? Math.abs(Number(client.angle)) % 360 : 0,
        text:  sanitize(client.text, 300),
      };
      if (client.id) {
        await supabase.from('trusted_clients').upsert({ id: client.id, ...payload }, { onConflict: 'id' });
      } else {
        await supabase.from('trusted_clients').insert(payload);
      }
    }
    const ids = clients.map(c => c.id).filter(Boolean);
    if (ids.length > 0) {
      await supabase.from('trusted_clients').delete().not('id', 'in', `(${ids.join(',')})`);
    } else {
      await supabase.from('trusted_clients').delete().neq('id', 0);
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Could not update clients' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED: ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/admin/users', auth, adminOnly, async (req, res) => {
  const { data, error } = await supabase.from('users').select('id, username, email, created_at').eq('role', 'user').order('id', { ascending: false });
  if (error) return res.status(500).json({ error: 'Server error' });
  res.json(data);
});

app.get('/api/admin/sessions', auth, adminOnly, async (req, res) => {
  // Update inactive
  const twoMinsAgo = new Date(Date.now() - 120000).toISOString();
  await supabase.from('site_visitors').update({ is_active: 0 }).eq('is_active', 1).lt('last_seen', twoMinsAgo);
  
  const { data } = await supabase.from('site_visitors').select('id, visitor_id, username, first_seen, last_seen, is_active').order('last_seen', { ascending: false }).limit(100);
  res.json(data || []);
});

app.get('/api/admin/contacts', auth, adminOnly, async (req, res) => {
  const { data, error } = await supabase.from('contact_requests').select('*').order('timestamp', { ascending: false }).limit(200);
  if (error) return res.status(500).json({ error: 'Server error' });
  res.json(data);
});

app.put('/api/admin/contacts/:id/read', auth, adminOnly, [
  param('id').isInt({ min: 1 }).withMessage('Invalid contact ID'),
], validate, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { error } = await supabase.from('contact_requests').update({ is_read: 1 }).eq('id', id);
  if (error) return res.status(500).json({ error: 'Server error' });
  res.json({ success: true });
});

// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED: MESSAGES
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/messages', auth, [
  query('user_id').isInt({ min: 1 }).withMessage('Valid user_id required'),
], validate, async (req, res) => {
  const user_id = parseInt(req.query.user_id, 10);
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  
  const { data, error } = await supabase.from('messages').select('id, sender, text, timestamp, is_read').eq('user_id', user_id).order('timestamp', { ascending: true });
  if (error) return res.status(500).json({ error: 'Server error' });
  res.json(data);
});

app.post('/api/messages', auth, [
  body('text').isString().trim().isLength({ min: 1, max: 2000 }).withMessage('Message text required (max 2000 chars)'),
  body('user_id').isInt({ min: 1 }).withMessage('Valid user_id required'),
], validate, async (req, res) => {
  const text    = sanitize(req.body.text, 2000);
  const user_id = parseInt(req.body.user_id, 10);
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  
  const sender = req.user.role === 'admin' ? 'Developer' : 'User';
  const { data, error } = await supabase.from('messages').insert({ sender, text, user_id }).select();
  if (error) return res.status(500).json({ error: 'Server error' });
  res.status(201).json({ success: true, id: data[0].id });
});

app.put('/api/messages/read', auth, [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user_id required'),
], validate, async (req, res) => {
  const user_id = parseInt(req.body.user_id, 10);
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  
  const senderToMark = req.user.role === 'admin' ? 'User' : 'Developer';
  const { error } = await supabase.from('messages').update({ is_read: 1 }).eq('user_id', user_id).eq('sender', senderToMark);
  if (error) return res.status(500).json({ error: 'Server error' });
  res.json({ success: true });
});

app.get('/api/messages/unread', auth, [
  query('user_id').isInt({ min: 1 }).withMessage('Valid user_id required'),
], validate, async (req, res) => {
  const user_id = parseInt(req.query.user_id, 10);
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  
  const sender = req.user.role === 'admin' ? 'User' : 'Developer';
  const { count, error } = await supabase.from('messages').select('id', { count: 'exact' }).eq('user_id', user_id).eq('sender', sender).eq('is_read', 0);
  if (error) return res.status(500).json({ error: 'Server error' });
  res.json({ count });
});

// ══════════════════════════════════════════════════════════════════════════════
// GROQ AI CHATBOT & LEAD CAPTURE ENGINE
// ══════════════════════════════════════════════════════════════════════════════

// Groq API Key Pool for High Availability Failover (Read securely from process.env)
const getGroqKeys = () => {
  const envKeys = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
  return envKeys.split(',').map(k => k.trim()).filter(Boolean);
};

let currentGroqKeyIdx = 0;
const getGroqClient = () => {
  const keys = getGroqKeys();
  if (keys.length === 0) return null;
  const key = keys[currentGroqKeyIdx % keys.length];
  return new Groq({ apiKey: key });
};

// Rate Limiter for Chat Endpoint: max 20 requests per 10 minutes per IP
const chatRateLimitStore = new Map();
const chatLimiter = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 20;

  const record = chatRateLimitStore.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }
  chatRateLimitStore.set(ip, record);

  if (record.count > maxRequests) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. You can send up to 20 messages per 10 minutes. Please reach out to our team directly on WhatsApp (+92 303 0111550).' 
    });
  }
  next();
};

// POST /api/chat - AI Chatbot completion proxy
app.post('/api/chat', chatLimiter, [
  body('messages').isArray({ min: 1, max: 30 }).withMessage('Messages array (1-30) required'),
], validate, async (req, res) => {
  try {
    const rawMessages = req.body.messages;
    
    // Check total conversation length & input sanitization
    const lastUserMsg = rawMessages[rawMessages.length - 1];
    if (!lastUserMsg || typeof lastUserMsg.content !== 'string') {
      return res.status(400).json({ error: 'Invalid message payload' });
    }

    if (lastUserMsg.content.length > 2000) {
      return res.status(400).json({ error: 'Message exceeds maximum length of 2000 characters' });
    }

    const keys = getGroqKeys();
    if (keys.length === 0) {
      return res.status(503).json({
        error: 'AI assistant key not configured on server. Please chat with us on WhatsApp (+92 303 0111550).',
        whatsappFallback: true
      });
    }

    // Build message array with server-side system prompt
    const conversation = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...rawMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: xss(String(m.content).slice(0, 2000))
      }))
    ];

    // Attempt completion with key rotation fallback
    let responseText = null;
    let attempts = 0;
    const maxAttempts = keys.length;

    while (attempts < maxAttempts && !responseText) {
      try {
        const groq = getGroqClient();
        if (!groq) break;
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: conversation,
          temperature: 0.4,
          max_tokens: 350,
          top_p: 0.9,
        });

        responseText = completion.choices[0]?.message?.content;
      } catch (err) {
        console.warn(`[Groq Failover] Key index ${currentGroqKeyIdx} failed: ${err.message}. Rotating...`);
        currentGroqKeyIdx = (currentGroqKeyIdx + 1) % keys.length;
        attempts++;
      }
    }

    if (!responseText) {
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable. Please chat with us on WhatsApp (+92 303 0111550) or email devnexes.support@gmail.com.',
        whatsappFallback: true
      });
    }

    res.json({ reply: responseText });
  } catch (err) {
    console.error('[API /api/chat error]', err);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// POST /api/lead - Capture qualified lead details & store in Supabase
app.post('/api/lead', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('contact').trim().notEmpty().withMessage('Email or Phone required'),
], validate, async (req, res) => {
  try {
    const { name, contact, service, note } = req.body;

    // Save lead to Supabase 'leads' or 'contact_requests' table
    try {
      await supabase.from('leads').insert({
        name: xss(name),
        contact: xss(contact),
        service: xss(service || 'General Inquiry'),
        note: xss(note || ''),
        created_at: new Date().toISOString()
      });
    } catch (e) {
      console.log('[Lead Supabase store notice]:', e.message);
    }

    res.json({ success: true, message: 'Lead captured successfully! Our team will reach out within 2 hours.' });
  } catch (err) {
    console.error('[API /api/lead error]', err);
    res.status(500).json({ error: 'Failed to record lead' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// CATCH-ALL & ERROR HANDLER
// ══════════════════════════════════════════════════════════════════════════════
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
