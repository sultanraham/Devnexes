import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import xss from 'xss';
import { body, param, query, validationResult } from 'express-validator';
import { createClient } from '@supabase/supabase-js';

// ── Environment (never hardcode secrets) ───────────────────────────────────────
const supabaseUrl  = process.env.VITE_SUPABASE_URL  || 'https://xxclkvohboxhhziyegsj.supabase.co';
const supabaseKey  = process.env.SUPABASE_SERVICE_KEY;
const JWT_SECRET   = process.env.JWT_SECRET;

if (!supabaseKey || !JWT_SECRET) {
  console.error('[FATAL] Missing required environment variables. Check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const app  = express();
const port = process.env.PORT || 5001;

// ══════════════════════════════════════════════════════════════════════════════
// SECURITY HEADERS (helmet — covers HSTS, CSP, nosniff, frameguard, etc.)
// ══════════════════════════════════════════════════════════════════════════════
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],       // inline styles used by React
      imgSrc:      ["'self'", "data:", "https:", "blob:"],
      connectSrc:  ["'self'", supabaseUrl, "https://api.dicebear.com", "https://api.qrserver.com"],
      fontSrc:     ["'self'", "https://fonts.gstatic.com"],
      objectSrc:   ["'none'"],
      frameSrc:    ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,  // needed for external images
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// Remove Express fingerprint
app.disable('x-powered-by');

// ── CORS (strict whitelist) ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'https://unadorned-crinkle-coach.ngrok-free.dev'
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parser: reject oversized payloads ─────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ══════════════════════════════════════════════════════════════════════════════
// RATE LIMITERS — in-memory (per IP)
// ══════════════════════════════════════════════════════════════════════════════
const makeRateLimiter = (maxRequests, windowMs, message) => {
  const store = new Map();
  // Clean up stale entries every 10 min to prevent memory bloat
  setInterval(() => {
    const now = Date.now();
    for (const [ip, e] of store) { if (now >= e.resetAt) store.delete(ip); }
  }, 10 * 60 * 1000);

  return (req, res, next) => {
    const ip  = req.ip;
    const now = Date.now();
    const entry = store.get(ip);
    if (entry && now < entry.resetAt) {
      if (entry.count >= maxRequests)
        return res.status(429).json({ error: message });
      entry.count++;
    } else {
      store.set(ip, { count: 1, resetAt: now + windowMs });
    }
    next();
  };
};

const loginLimiter   = makeRateLimiter(5,  15 * 60 * 1000, 'Too many login attempts. Try again in 15 minutes.');
const contactLimiter = makeRateLimiter(3,  10 * 60 * 1000, 'Too many messages. Please wait before trying again.');
const registerLimiter= makeRateLimiter(5,  60 * 60 * 1000, 'Too many registrations. Try again later.');
const globalLimiter  = makeRateLimiter(100, 60 * 1000,     'Too many requests. Please slow down.');
app.use(globalLimiter);

// ══════════════════════════════════════════════════════════════════════════════
// DATABASE
// ══════════════════════════════════════════════════════════════════════════════
const db = new sqlite3.Database('./database.db');

// Enable WAL mode for better concurrency and enable foreign keys
db.serialize(() => {
  db.run("PRAGMA journal_mode=WAL");
  db.run("PRAGMA foreign_keys=ON");

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    is_read INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS social_data (
    id INTEGER PRIMARY KEY,
    transaction_volume TEXT DEFAULT '9.9M',
    split_values TEXT DEFAULT '3.5%',
    reviewed_by TEXT DEFAULT '100k+',
    social_proof TEXT DEFAULT ''
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS trusted_clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    ring TEXT DEFAULT 'outer',
    angle INTEGER DEFAULT 0,
    text TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS contact_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT DEFAULT 'General',
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS site_visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT UNIQUE NOT NULL,
    username TEXT,
    first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 1
  )`);

  // Seed admin user
  const adminHash = bcrypt.hashSync('admin321', 12);
  db.run("INSERT OR IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
    ['admin', adminHash, 'admin@devnexes.com', 'admin']);

  const defaultSettings = [
    ['download_title',    'DOWNLOAD APP'],
    ['download_subtitle', 'Master your project flow.'],
    ['download_desc',     'Manage your digital operations anytime, anywhere.'],
    ['qr_url',           'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://devnexes.site'],
    ['mobile_wallpaper', 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&q=80&w=800']
  ];
  defaultSettings.forEach(s => db.run("INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)", s));

  db.run("INSERT OR IGNORE INTO social_data (id) VALUES (1)");

  const clients = [
    ['Sara',    'Digital Creator',    'outer',  0,   'Quick and easy account opening.'],
    ['Jack',    'Software Engineer',  'outer',  90,  'Best automation tools available.'],
    ['Oliver',  'Business Owner',     'outer',  180, 'Expert technical guidance.'],
    ['Emma',    'Marketing Lead',     'outer',  270, 'Secure digital platforms.'],
    ['Sophie',  'UX Designer',        'middle', 45,  'A game changer for workflow.'],
    ['Charlie', 'Product Manager',    'middle', 135, 'Real insights within a week.'],
    ['Aneka',   'Entrepreneur',       'middle', 225, 'Best investment for startups.'],
    ['Molly',   'Tech Architect',     'middle', 315, 'Robust infrastructure.']
  ];
  clients.forEach(c => db.run("INSERT OR IGNORE INTO trusted_clients (name, role, ring, angle, text) VALUES (?, ?, ?, ?, ?)", c));
});

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

// XSS-safe sanitiser: strips HTML tags AND trims
const sanitize = (str, maxLen = 500) =>
  xss((str || '').toString().trim(), { whiteList: {}, stripIgnoreTag: true }).slice(0, maxLen);

// Email validator
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Username: only alphanumeric + _ . - (prevents SQL / shell injection via username)
const isValidUsername = (u) => /^[a-zA-Z0-9_.\-]{3,50}$/.test(u);

// express-validator error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });
  next();
};

// ── Auth middleware ────────────────────────────────────────────────────────────
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

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// ── Login ──────────────────────────────────────────────────────────────────────
app.post('/api/login', loginLimiter, [
  body('username').isString().trim().notEmpty().withMessage('Username is required').isLength({ max: 50 }),
  body('password').isString().notEmpty().withMessage('Password is required').isLength({ max: 100 }),
], validate, (req, res) => {
  const username = sanitize(req.body.username, 50);
  const password = req.body.password;           // Don't sanitize password — breaks hashing

  const INVALID = 'Invalid username or password'; // Same msg — prevents username enumeration

  // All DB queries use parameterized statements — SQL injection impossible
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!row || !bcrypt.compareSync(password, row.password))
      return res.status(401).json({ success: false, message: INVALID });

    const token = jwt.sign(
      { id: row.id, username: row.username, role: row.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ success: true, token, user: { id: row.id, username: row.username, email: row.email, role: row.role } });
  });
});

// ── Register ───────────────────────────────────────────────────────────────────
app.post('/api/register', registerLimiter, [
  body('username').isString().trim().notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], validate, (req, res) => {
  const username = sanitize(req.body.username, 50);
  const email    = sanitize(req.body.email, 100);
  const password = req.body.password;

  if (!isValidUsername(username))
    return res.status(400).json({ error: 'Username may only contain letters, numbers, underscores, dots and hyphens (3–50 chars)' });

  const hash = bcrypt.hashSync(password, 12);
  db.run("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [username, hash, email], function(err) {
    if (err) return res.status(400).json({ error: 'Username or email already exists' });
    res.status(201).json({ success: true, id: this.lastID });
  });
});

// ── Contact form ───────────────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, [
  body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('message').isString().trim().isLength({ min: 5, max: 2000 }).withMessage('Message must be 5–2000 characters'),
], validate, (req, res) => {
  const name    = sanitize(req.body.name, 100);
  const email   = sanitize(req.body.email, 100);
  const message = sanitize(req.body.message, 2000);

  // Parameterized query — fully SQL-injection proof
  db.run("INSERT INTO contact_requests (name, email, message) VALUES (?, ?, ?)",
    [name, email, message], function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.status(201).json({ success: true });
    });
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
], validate, (req, res) => {
  const visitor_id = sanitize(req.body.visitor_id, 128);
  const username   = sanitize(req.body.username || 'Anonymous', 50);

  // Parameterized — SQL-injection safe
  db.get("SELECT id FROM site_visitors WHERE visitor_id = ?", [visitor_id], (err, row) => {
    if (row) {
      db.run("UPDATE site_visitors SET username = ?, last_seen = CURRENT_TIMESTAMP, is_active = 1 WHERE visitor_id = ?",
        [username, visitor_id], () => res.json({ success: true }));
    } else {
      db.run("INSERT INTO site_visitors (visitor_id, username) VALUES (?, ?)",
        [visitor_id, username], () => res.json({ success: true }));
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED: SETTINGS (admin)
// ══════════════════════════════════════════════════════════════════════════════
app.put('/api/settings', auth, adminOnly, (req, res) => {
  const ALLOWED_KEYS = new Set(['download_title', 'download_subtitle', 'download_desc', 'qr_url', 'mobile_wallpaper']);
  const updates = Object.fromEntries(
    Object.entries(req.body)
      .filter(([k]) => ALLOWED_KEYS.has(k))
      .map(([k, v]) => [k, sanitize(v)])
  );
  if (Object.keys(updates).length === 0) return res.json({ success: true });

  (async () => {
    for (const [key, value] of Object.entries(updates)) {
      await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
    }
    res.json({ success: true });
  })().catch(() => res.status(500).json({ error: 'Could not save settings' }));
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
        ring:  VALID_RINGS.has(client.ring) ? client.ring : 'outer', // enum validation
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
app.get('/api/admin/users', auth, adminOnly, (req, res) => {
  db.all("SELECT id, username, email, created_at FROM users WHERE role = 'user' ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

app.get('/api/admin/sessions', auth, adminOnly, (req, res) => {
  db.run("UPDATE site_visitors SET is_active = 0 WHERE is_active = 1 AND strftime('%s','now') - strftime('%s', last_seen) > 120", () => {
    db.all("SELECT id, visitor_id, username, first_seen, last_seen, is_active FROM site_visitors ORDER BY last_seen DESC LIMIT 100", [], (err, rows) => {
      res.json(rows || []);
    });
  });
});

app.get('/api/admin/contacts', auth, adminOnly, (req, res) => {
  // Parameterized query — no injection risk
  db.all("SELECT * FROM contact_requests ORDER BY timestamp DESC LIMIT 200", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

app.put('/api/admin/contacts/:id/read', auth, adminOnly, [
  param('id').isInt({ min: 1 }).withMessage('Invalid contact ID'),
], validate, (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.run("UPDATE contact_requests SET is_read = 1 WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED: MESSAGES
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/messages', auth, [
  query('user_id').isInt({ min: 1 }).withMessage('Valid user_id required'),
], validate, (req, res) => {
  const user_id = parseInt(req.query.user_id, 10);
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  db.all("SELECT id, sender, text, timestamp, is_read FROM messages WHERE user_id = ? ORDER BY timestamp ASC", [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

app.post('/api/messages', auth, [
  body('text').isString().trim().isLength({ min: 1, max: 2000 }).withMessage('Message text required (max 2000 chars)'),
  body('user_id').isInt({ min: 1 }).withMessage('Valid user_id required'),
], validate, (req, res) => {
  const text    = sanitize(req.body.text, 2000);
  const user_id = parseInt(req.body.user_id, 10);
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  const sender = req.user.role === 'admin' ? 'Developer' : 'User';
  db.run("INSERT INTO messages (sender, text, user_id) VALUES (?, ?, ?)", [sender, text, user_id], function(err) {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.status(201).json({ success: true, id: this.lastID });
  });
});

app.put('/api/messages/read', auth, [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user_id required'),
], validate, (req, res) => {
  const user_id = parseInt(req.body.user_id, 10);
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  const senderToMark = req.user.role === 'admin' ? 'User' : 'Developer';
  db.run("UPDATE messages SET is_read = 1 WHERE user_id = ? AND sender = ?", [user_id, senderToMark], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true });
  });
});

app.get('/api/messages/unread', auth, [
  query('user_id').isInt({ min: 1 }).withMessage('Valid user_id required'),
], validate, (req, res) => {
  const user_id = parseInt(req.query.user_id, 10);
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  const sender = req.user.role === 'admin' ? 'User' : 'Developer';
  db.get("SELECT COUNT(*) as count FROM messages WHERE user_id = ? AND sender = ? AND is_read = 0",
    [user_id, sender], (err, row) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ count: row.count });
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// CATCH-ALL & ERROR HANDLER
// ══════════════════════════════════════════════════════════════════════════════
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Global error handler — never leak stack traces
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Bind only to localhost — never expose directly on 0.0.0.0 in production
app.listen(port, '127.0.0.1', () =>
  console.log(`✅ Secure server running at http://127.0.0.1:${port}`)
);
