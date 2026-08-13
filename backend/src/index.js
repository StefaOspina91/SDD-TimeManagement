const express = require('express');
const users = require('./db/in-memory-users');
const { inMemoryAbsenceStore } = require('./db/in-memory-absences');

const app = express();

// Allow CORS from the frontend origin(s) and allow credentials
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGINS || 'http://127.0.0.1:3000,http://localhost:3000').split(',');
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());

const mockAuth = require('./auth/mock-auth-middleware');
app.use(mockAuth);

app.get('/health', (req, res) => res.json({ ok: true, database: 'memory' }));

// --- Auth endpoints ---
app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, fullName } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  if (!users.isDomainAllowed(email)) {
    return res.status(400).json({ error: `Email domain not allowed. Allowed: ${users.allowedDomains.join(', ')}` });
  }

  try {
    const user = users.createUser({ email, password, fullName });
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password, remember } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = users.authenticate(email, password);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const token = users.createSession(user.id);
  // Build a cookie with Path and Domain so programmatic clients can persist it reliably during tests
  const cookieParts = ['tm_token=' + token, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (remember) cookieParts.push(`Max-Age=${60 * 60 * 24 * 30}`); // 30 days
  const domain = (req.headers.host || '').split(':')[0] || req.hostname;
  if (domain) cookieParts.push(`Domain=${domain}`);

  res.setHeader('Set-Cookie', cookieParts.join('; '));
  return res.json({ id: user.id, email: user.email, fullName: user.fullName, role: user.role });
});

app.post('/api/v1/auth/logout', (req, res) => {
  const cookie = req.headers.cookie || '';
  const token = (cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith('tm_token=')) || '').split('=')[1];
  if (token) users.deleteSession(token);
  // clear cookie (include Path and Domain)
  const clearDomain = (req.headers.host || '').split(':')[0] || req.hostname;
  res.setHeader('Set-Cookie', `tm_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${clearDomain ? '; Domain=' + clearDomain : ''}`);
  return res.json({ ok: true });
});

app.get('/api/v1/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'not authenticated' });
  return res.json({ id: req.user.id, email: req.user.email, fullName: req.user.fullName, role: req.user.role, teamId: req.user.teamId });
});

app.put('/api/v1/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'not authenticated' });
  const { fullName } = req.body || {};
  const u = users.getById(req.user.id);
  if (!u) return res.status(404).json({ error: 'user not found' });
  if (fullName) u.fullName = fullName;
  return res.json({ id: u.id, email: u.email, fullName: u.fullName, role: u.role, teamId: u.teamId });
});

// allowed domains
app.get('/api/v1/auth/allowed-domains', (req, res) => {
  return res.json({ allowedDomains: users.allowedDomains });
});

// --- Absences ---
app.get('/api/v1/absences', (req, res) => {
  const { start, end, teamId } = req.query;
  res.json(inMemoryAbsenceStore.list({ start, end, teamId }));
});

app.post('/api/v1/absences', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'authentication required' });
  const payload = req.body || {};
  const absence = inMemoryAbsenceStore.create({
    ...payload,
    collaboratorId: payload.collaboratorId || req.user.id,
    teamId: payload.teamId || req.user.teamId
  });

  res.status(201).json(absence);
});

app.patch('/api/v1/absences/:id', (req, res) => {
  const { id } = req.params;
  const existing = inMemoryAbsenceStore.getById(id);

  if (!existing) {
    return res.status(404).json({ error: 'Absence not found' });
  }

  if (!req.user) return res.status(401).json({ error: 'authentication required' });
  if (existing.collaboratorId !== req.user.id && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'You cannot edit this absence' });
  }

  const updated = inMemoryAbsenceStore.update(id, req.body || {});
  return res.json(updated);
});

app.delete('/api/v1/absences/:id', (req, res) => {
  const { id } = req.params;
  const existing = inMemoryAbsenceStore.getById(id);

  if (!existing) {
    return res.status(404).json({ error: 'Absence not found' });
  }

  if (!req.user) return res.status(401).json({ error: 'authentication required' });
  if (existing.collaboratorId !== req.user.id && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'You cannot delete this absence' });
  }

  const removed = inMemoryAbsenceStore.remove(id);
  return res.status(removed ? 204 : 404).send();
});

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Backend listening on ${port}`));
}

module.exports = { app, inMemoryAbsenceStore };
