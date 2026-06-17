import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const port = 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'devnexes_jwt_secret_change_in_prod';

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'https://unadorned-crinkle-coach.ngrok-free.dev'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); // prevent oversized payloads

// ── Simple in-memory rate limiter for /api/login ──────────────────────────────
const loginAttempts = new Map(); // ip -> { count, resetAt }
const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= 10) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    entry.count++;
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
  }
  next();
};

// ── Database ──────────────────────────────────────────────────────────────────
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user'
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending Approval',
    payment_status TEXT DEFAULT 'Unpaid',
    contract_status TEXT DEFAULT 'Pending',
    progress INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'In Progress',
    approved INTEGER DEFAULT 0,
    is_requested INTEGER DEFAULT 0,
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
  db.run(`CREATE TABLE IF NOT EXISTS contact_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT DEFAULT 'General',
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
  )`);

  // Seed admin
  const adminHash = bcrypt.hashSync('admin321', 10);
  db.run("INSERT OR IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
    ['admin', adminHash, 'admin@devnexes.com', 'admin']);

  const defaultSettings = [
    ['download_title', 'DOWNLOAD APP'],
    ['download_subtitle', 'Master your project flow.'],
    ['download_desc', 'Manage your digital operations anytime, anywhere.'],
    ['qr_url', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://devnexes.site'],
    ['mobile_wallpaper', 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&q=80&w=800']
  ];
  defaultSettings.forEach(s => db.run("INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)", s));
});

// ── Auth middleware ────────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};

// ── Sanitise helper ───────────────────────────────────────────────────────────
const clean = (str) => (str || '').toString().trim().slice(0, 500);

// ── Public routes ─────────────────────────────────────────────────────────────
app.post('/api/login', rateLimit, (req, res) => {
  const username = clean(req.body.username);
  const password = clean(req.body.password);
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!row || !bcrypt.compareSync(password, row.password))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    // Reset rate limit on success
    loginAttempts.delete(req.ip);
    const token = jwt.sign(
      { id: row.id, username: row.username, role: row.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ success: true, token, user: { id: row.id, username: row.username, email: row.email, role: row.role } });
  });
});

app.post('/api/register', (req, res) => {
  const username = clean(req.body.username);
  const password = clean(req.body.password);
  const email = clean(req.body.email);
  if (!username || !password || !email) return res.status(400).json({ error: 'Missing fields' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  const hash = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [username, hash, email], function(err) {
    if (err) return res.status(400).json({ error: 'Username or email already exists' });
    res.json({ success: true, id: this.lastID });
  });
});

app.post('/api/contact', (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email);
  const type = clean(req.body.type) || 'General';
  const message = clean(req.body.message);
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
  db.run("INSERT INTO contact_requests (name, email, type, message) VALUES (?, ?, ?, ?)",
    [name, email, type, message], function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ success: true });
    });
});

// Public read-only settings
app.get('/api/settings', (req, res) => {
  db.all("SELECT key, value FROM site_settings", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    const settings = {};
    rows.forEach(r => settings[r.key] = r.value);
    res.json(settings);
  });
});

// ── Protected: Settings ───────────────────────────────────────────────────────
app.put('/api/settings', auth, adminOnly, (req, res) => {
  const allowed = ['download_title', 'download_subtitle', 'download_desc', 'qr_url', 'mobile_wallpaper'];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k)).map(([k, v]) => [k, clean(v)])
  );
  const keys = Object.keys(updates);
  if (keys.length === 0) return res.json({ success: true });
  let done = 0;
  keys.forEach(key => {
    db.run("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)", [key, updates[key]], () => {
      if (++done === keys.length) res.json({ success: true });
    });
  });
});

// ── Protected: Admin — users ──────────────────────────────────────────────────
app.get('/api/admin/users', auth, adminOnly, (req, res) => {
  db.all("SELECT id, username, email, created_at FROM users WHERE role = 'user' ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

// Admin: view contact requests
app.get('/api/admin/contacts', auth, adminOnly, (req, res) => {
  db.all("SELECT * FROM contact_requests ORDER BY timestamp DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

app.put('/api/admin/contacts/:id/read', auth, adminOnly, (req, res) => {
  db.run("UPDATE contact_requests SET is_read = 1 WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true });
  });
});

// ── Protected: Projects ───────────────────────────────────────────────────────
app.get('/api/projects', auth, (req, res) => {
  const { user_id } = req.query;
  if (req.user.role !== 'admin' && String(req.user.id) !== String(user_id))
    return res.status(403).json({ error: 'Forbidden' });
  const query = user_id ? "SELECT * FROM projects WHERE user_id = ? ORDER BY id DESC" : "SELECT * FROM projects ORDER BY id DESC";
  const params = user_id ? [user_id] : [];
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

app.post('/api/projects', auth, (req, res) => {
  const name = clean(req.body.name);
  const description = clean(req.body.description);
  if (!name) return res.status(400).json({ error: 'Project name required' });
  const targetUserId = req.user.role === 'admin' ? req.body.user_id : req.user.id;
  if (!targetUserId) return res.status(400).json({ error: 'user_id required' });
  db.run("INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)",
    [name, description, targetUserId], function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ success: true, id: this.lastID });
    });
});

app.put('/api/projects/:id/status', auth, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  const { status, payment_status, contract_status, progress } = req.body;
  const validStatuses = ['Pending Approval', 'Active', 'Completed', 'On Hold'];
  const validPayment  = ['Unpaid', 'Paid', 'Partial'];
  const validContract = ['Pending', 'Signed', 'Cancelled'];
  if (status && !validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  if (payment_status && !validPayment.includes(payment_status)) return res.status(400).json({ error: 'Invalid payment_status' });
  if (contract_status && !validContract.includes(contract_status)) return res.status(400).json({ error: 'Invalid contract_status' });
  if (progress !== undefined && (progress < 0 || progress > 100)) return res.status(400).json({ error: 'Invalid progress' });
  db.run(
    "UPDATE projects SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status), contract_status = COALESCE(?, contract_status), progress = COALESCE(?, progress) WHERE id = ?",
    [status || null, payment_status || null, contract_status || null, progress ?? null, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ success: true });
    }
  );
});

app.delete('/api/projects/:id', auth, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  db.run("DELETE FROM tasks WHERE project_id = ?", [id], () => {
    db.run("DELETE FROM projects WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ success: true });
    });
  });
});

// ── Protected: Tasks ──────────────────────────────────────────────────────────
app.get('/api/projects/:id/tasks', auth, (req, res) => {
  const projectId = parseInt(req.params.id);
  // Verify user owns the project (or is admin)
  db.get("SELECT user_id FROM projects WHERE id = ?", [projectId], (err, project) => {
    if (err || !project) return res.status(404).json({ error: 'Project not found' });
    if (req.user.role !== 'admin' && String(req.user.id) !== String(project.user_id))
      return res.status(403).json({ error: 'Forbidden' });
    db.all("SELECT * FROM tasks WHERE project_id = ? ORDER BY id ASC", [projectId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: 'Server error' });
      res.json(rows);
    });
  });
});

app.post('/api/tasks', auth, (req, res) => {
  const name = clean(req.body.name);
  const project_id = parseInt(req.body.project_id);
  const is_requested = req.body.is_requested ? 1 : 0;
  if (!name || !project_id) return res.status(400).json({ error: 'name and project_id required' });
  // Verify ownership
  db.get("SELECT user_id FROM projects WHERE id = ?", [project_id], (err, project) => {
    if (err || !project) return res.status(404).json({ error: 'Project not found' });
    if (req.user.role !== 'admin' && String(req.user.id) !== String(project.user_id))
      return res.status(403).json({ error: 'Forbidden' });
    db.run("INSERT INTO tasks (project_id, name, is_requested) VALUES (?, ?, ?)",
      [project_id, name, is_requested], function(err2) {
        if (err2) return res.status(500).json({ error: 'Server error' });
        res.json({ success: true, id: this.lastID });
      });
  });
});

app.put('/api/tasks/:id/status', auth, adminOnly, (req, res) => {
  const validTaskStatuses = ['In Progress', 'Delayed', 'Blocked', 'Done'];
  const status = req.body.status;
  if (!validTaskStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.run("UPDATE tasks SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true });
  });
});

app.put('/api/tasks/:id/approve', auth, adminOnly, (req, res) => {
  db.run("UPDATE tasks SET approved = 1, status = 'Done' WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true });
  });
});

app.delete('/api/tasks/:id', auth, (req, res) => {
  const taskId = parseInt(req.params.id);
  // Admins can delete any task; clients can only delete their own requested tasks
  if (req.user.role === 'admin') {
    db.run("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ success: true });
    });
  } else {
    db.get("SELECT t.id FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = ? AND p.user_id = ? AND t.is_requested = 1 AND t.approved = 0",
      [taskId, req.user.id], (err, row) => {
        if (err || !row) return res.status(403).json({ error: 'Forbidden' });
        db.run("DELETE FROM tasks WHERE id = ?", [taskId], (err2) => {
          if (err2) return res.status(500).json({ error: 'Server error' });
          res.json({ success: true });
        });
      });
  }
});

// ── Protected: Messages ───────────────────────────────────────────────────────
app.get('/api/messages', auth, (req, res) => {
  const user_id = parseInt(req.query.user_id);
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  db.all("SELECT * FROM messages WHERE user_id = ? ORDER BY timestamp ASC", [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

app.post('/api/messages', auth, (req, res) => {
  const text = clean(req.body.text);
  const user_id = parseInt(req.body.user_id);
  if (!text || !user_id) return res.status(400).json({ error: 'text and user_id required' });
  // Clients can only post to their own thread; admin can post to any
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  const sender = req.user.role === 'admin' ? 'Developer' : 'User';
  db.run("INSERT INTO messages (sender, text, user_id) VALUES (?, ?, ?)", [sender, text, user_id], function(err) {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true, id: this.lastID });
  });
});

// Mark messages as read (admin marks client messages read; client marks developer messages read)
app.put('/api/messages/read', auth, (req, res) => {
  const user_id = parseInt(req.body.user_id);
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  const senderToMark = req.user.role === 'admin' ? 'User' : 'Developer';
  db.run("UPDATE messages SET is_read = 1 WHERE user_id = ? AND sender = ?", [user_id, senderToMark], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true });
  });
});

// Unread count for client
app.get('/api/messages/unread', auth, (req, res) => {
  const user_id = parseInt(req.query.user_id);
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  if (req.user.role !== 'admin' && req.user.id !== user_id)
    return res.status(403).json({ error: 'Forbidden' });
  const sender = req.user.role === 'admin' ? 'User' : 'Developer';
  db.get("SELECT COUNT(*) as count FROM messages WHERE user_id = ? AND sender = ? AND is_read = 0",
    [user_id, sender], (err, row) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ count: row.count });
    });
});

app.listen(port, '0.0.0.0', () => console.log(`Server running at http://127.0.0.1:${port}`));
