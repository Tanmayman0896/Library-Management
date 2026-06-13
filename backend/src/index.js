require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { startSweepJob } = require('./jobs/sweep');

const authRoutes = require('./routes/auth');
const deskRoutes = require('./routes/desks');
const sessionRoutes = require('./routes/sessions');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/desks', deskRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`DeskGuard backend running on http://localhost:${PORT}`);
    startSweepJob();
  });
}
