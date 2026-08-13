const express = require('express');
const app = express();
app.use(express.json());

// Mock auth for local dev
const mockAuth = require('./auth/mock-auth-middleware');
app.use(mockAuth);

app.get('/health', (req, res) => res.json({ ok: true }));

// Placeholder absences endpoint
app.get('/api/v1/absences', (req, res) => {
  res.json([]);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend listening on ${port}`));
