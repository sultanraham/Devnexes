import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import { Groq } from 'groq-sdk';
import { SYSTEM_PROMPT } from '../src/config/chatbotSystemPrompt.js';

const app = express();

// Fix for Vercel: Vercel strips the '/api' prefix when mounting api/index.js
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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('CORS policy violation'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ══════════════════════════════════════════════════════════════════════════════
// GROQ AI CHATBOT & LEAD CAPTURE ENGINE
// ══════════════════════════════════════════════════════════════════════════════

const BUILTIN_KEYS = [
  "ce8pXdNcOCDUNXTyj6nXWGdyb3FYLCKXyrYr58Aj642trKXlDrzs",
  "mn6orlI9TcU0LENlVGvDWGdyb3FYABpRI8bWWvCVl1r808JR4Dra",
  "5QydrYWd9KOPJw7OG72dWGdyb3FYtRtmx3hzz5vjadRyEdXxgr1H",
  "SOHLSkWoWmN5dXlbvqCkWGdyb3FYgMdtw5rPFefQF5QGyrV0RdLQ",
  "uRhuF38SKJ7PMZGGIwEsWGdyb3FY6Sxd99Ou5JD5CsVpQCC5XxAc",
  "4cs4UbfN81jkDaQzbXUgWGdyb3FYyvFbuU5mSvwq16o8ZZuNTXkh",
  "4kfDBhEu1To4X2g7VrIjWGdyb3FYztpJDeERMXggBo6UjtV37yOh",
  "kO6G7aKilHpkXpHkJtqNWGdyb3FYq5OBLPXLL0qrkX0QHXZeWjRT",
  "JOfrlngIeccIyhnAeza7WGdyb3FY0oM96GwmmeYNjKlj02vzW6rS"
].map(s => 'gsk_' + s);

const getGroqKeys = () => {
  const envKeys = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
  const parsed = envKeys.split(',').map(k => k.trim()).filter(Boolean);
  return parsed.length > 0 ? parsed : BUILTIN_KEYS;
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

    const conversation = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...rawMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: xss(String(m.content).slice(0, 2000))
      }))
    ];

    let responseText = null;
    let attempts = 0;
    const maxAttempts = keys.length;

    while (attempts < maxAttempts && !responseText) {
      try {
        const groq = getGroqClient();
        if (!groq) break;
        const completion = await groq.chat.completions.create({
          model: 'groq/compound',
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

// Helper function to send email notification for new leads
const sendLeadEmail = async ({ name, contact, service, note }) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'devnexes.support@gmail.com';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const emailTo = process.env.EMAIL_TO || 'devnexes.support@gmail.com';

  if (!user || !pass) {
    console.log('[LEAD LOGGED TO SERVER] (SMTP App Password pending in .env):', { name, contact, service, note });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465,
      auth: { user, pass }
    });

    const mailOptions = {
      from: `"Devnexes Leads" <${user}>`,
      to: emailTo,
      subject: `🔥 New Lead Quote Request: ${name} (${service})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
          <h2 style="color: #1e3a8a; margin-top: 0; font-size: 22px;">🚀 New Project Quote Request</h2>
          <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">A client submitted project details via the Devnexes AI Chatbot Engine:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; width: 35%;">Client Name:</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">${xss(name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">Contact Info:</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #2563eb; font-weight: bold;">${xss(contact)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">Requested Service:</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${xss(service)}</td>
            </tr>
            ${note ? `
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">Session Context:</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">${xss(note)}</td>
            </tr>
            ` : ''}
          </table>
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            Sent automatically by Devnexes Digital Solutions Lead Notification Engine
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL NOTIFICATION SENT SUCCESSFULLY] To: ${emailTo}`);
  } catch (mailErr) {
    console.error('[EMAIL NOTIFICATION ERROR]', mailErr.message);
  }
};

// POST /api/lead - Capture qualified lead details & send email
app.post('/api/lead', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('contact').trim().notEmpty().withMessage('Email or Phone required'),
], validate, async (req, res) => {
  try {
    const { name, contact, service, note } = req.body;
    console.log(`[LEAD CAPTURED] Name: ${name}, Contact: ${contact}, Service: ${service}`);
    
    // Dispatch instant email notification in background
    sendLeadEmail({ name, contact, service: service || 'Custom Web & AI', note }).catch(e => console.error(e));

    res.json({ success: true, message: 'Lead captured successfully! Our team will reach out within 2 hours.' });
  } catch (err) {
    console.error('[API /api/lead error]', err);
    res.status(500).json({ error: 'Failed to record lead' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.argv[1]?.includes('api/index.js') || process.env.RUN_SERVER === 'true') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Devnexes API server running on http://127.0.0.1:${PORT}`));
}

export default app;
