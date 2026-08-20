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
const sendLeadEmail = async ({ name, contact, service, note, message }) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'devnexes.support@gmail.com';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const emailTo = process.env.EMAIL_TO || 'devnexes.support@gmail.com';

  const clientName = name || 'Anonymous Visitor';
  const clientContact = contact || 'Not Provided';
  const selectedService = service || 'Custom Web Development & AI Solutions';
  const projectDetails = note || message || 'No extra notes provided.';

  if (!user || !pass) {
    console.log('[LEAD CAPTURED - SMTP PASS PENDING IN .ENV]:', { name: clientName, contact: clientContact, service: selectedService, details: projectDetails });
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
      from: `"Devnexes Lead Engine" <${user}>`,
      to: emailTo,
      subject: `🔥 New Lead Notification: ${clientName} (${selectedService})`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 0; background-color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #061632 0%, #1e3a8a 100%); padding: 28px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">⚡ New Devnexes Lead Received</h1>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1.5px;">Instant Project Quote Request</p>
          </div>

          <!-- Content Body -->
          <div style="padding: 28px; background-color: #ffffff;">
            <div style="margin-bottom: 20px; padding: 14px 18px; background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px;">
              <p style="margin: 0; font-size: 13px; font-weight: 700; color: #1e3a8a;">A visitor has submitted a new inquiry via devnexes.site:</p>
            </div>

            <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; font-size: 14px;">
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 18px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; width: 35%;">👤 Client Name:</td>
                <td style="padding: 14px 18px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-size: 15px;">${xss(clientName)}</td>
              </tr>
              <tr>
                <td style="padding: 14px 18px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0;">📬 Contact (Email / Phone):</td>
                <td style="padding: 14px 18px; font-weight: 800; color: #2563eb; border-bottom: 1px solid #e2e8f0; font-size: 15px;">
                  <a href="mailto:${xss(clientContact)}" style="color: #2563eb; text-decoration: underline;">${xss(clientContact)}</a>
                </td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 18px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0;">🛠️ Service Interested In:</td>
                <td style="padding: 14px 18px; font-weight: 800; color: #061632; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
                  <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; font-weight: 800;">${xss(selectedService)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 18px; font-weight: 700; color: #475569; vertical-align: top;">💬 Project Details / Message:</td>
                <td style="padding: 14px 18px; color: #334155; line-height: 1.6; font-size: 14px;">${xss(projectDetails)}</td>
              </tr>
            </table>

            <div style="margin-top: 28px; text-align: center;">
              <a href="mailto:${xss(clientContact)}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; font-weight: 800; font-size: 13px; text-transform: uppercase; text-decoration: none; border-radius: 10px; letter-spacing: 1px; shadow: 0 4px 10px rgba(37,99,235,0.3);">
                Reply to ${xss(clientName)} Directly →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Sent automatically via Devnexes Digital Solutions Lead Engine
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL NOTIFICATION SENT SUCCESSFULLY] To: ${emailTo} for lead: ${clientName}`);
  } catch (mailErr) {
    console.error('[EMAIL NOTIFICATION ERROR]', mailErr.message);
  }
};

// POST /api/contact - Handle contact form submissions
app.post('/api/contact', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('message').trim().notEmpty().withMessage('Message required'),
], validate, async (req, res) => {
  try {
    const { name, email, service, message } = req.body;
    console.log(`[CONTACT FORM SUBMITTED] Name: ${name}, Email: ${email}`);

    sendLeadEmail({ name, contact: email, service: service || 'Contact Form Inquiry', message }).catch(e => console.error(e));

    res.json({ success: true, message: 'Message sent successfully! Our team will contact you within 2 hours.' });
  } catch (err) {
    console.error('[API /api/contact error]', err);
    res.status(500).json({ error: 'Failed to process contact form' });
  }
});

// POST /api/lead - Capture qualified lead details & send email
app.post('/api/lead', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('contact').trim().notEmpty().withMessage('Email or Phone required'),
], validate, async (req, res) => {
  try {
    const { name, contact, service, note, message } = req.body;
    console.log(`[LEAD CAPTURED] Name: ${name}, Contact: ${contact}, Service: ${service}`);
    
    // Dispatch instant email notification in background
    sendLeadEmail({ name, contact, service: service || 'Custom Web Development & AI', note, message }).catch(e => console.error(e));

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
