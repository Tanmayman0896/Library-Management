const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/sessions/active — current user's active session
router.get('/active', requireAuth, async (req, res, next) => {
  try {
    const session = await prisma.session.findFirst({
      where: { userId: req.user.id, status: { in: ['ACTIVE', 'AWAY'] } },
      include: {
        desk: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(session || null);
  } catch (err) { next(err); }
});

// GET /api/sessions/history — current user's past sessions
router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.user.id },
      include: { desk: true },
      orderBy: { startTime: 'desc' },
      take: 20,
    });
    res.json(sessions);
  } catch (err) { next(err); }
});

// POST /api/sessions/away — mark as stepping away
router.post('/away', requireAuth, async (req, res, next) => {
  try {
    const session = await prisma.session.findFirst({
      where: { userId: req.user.id, status: 'ACTIVE' },
    });
    if (!session) return res.status(404).json({ error: 'No active session found' });

    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.session.update({
        where: { id: session.id },
        data: { status: 'AWAY', awayStartTime: new Date() },
        include: { desk: true },
      });
      await tx.desk.update({ where: { id: session.deskId }, data: { status: 'AWAY' } });
      return s;
    });
    res.json(updated);
  } catch (err) { next(err); }
});

// POST /api/sessions/back — mark as back from away
router.post('/back', requireAuth, async (req, res, next) => {
  try {
    const session = await prisma.session.findFirst({
      where: { userId: req.user.id, status: 'AWAY' },
    });
    if (!session) return res.status(404).json({ error: 'No away session found' });

    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.session.update({
        where: { id: session.id },
        data: { status: 'ACTIVE', awayStartTime: null, lastPingTime: new Date() },
        include: { desk: true },
      });
      await tx.desk.update({ where: { id: session.deskId }, data: { status: 'OCCUPIED' } });
      return s;
    });
    res.json(updated);
  } catch (err) { next(err); }
});

// POST /api/sessions/confirm — respond to "Still here?" prompt (resets 2-hour timer)
router.post('/confirm', requireAuth, async (req, res, next) => {
  try {
    const session = await prisma.session.findFirst({
      where: { userId: req.user.id, status: { in: ['ACTIVE', 'AWAY'] } },
    });
    if (!session) return res.status(404).json({ error: 'No active session found' });

    const updated = await prisma.session.update({
      where: { id: session.id },
      data: { lastPingTime: new Date() },
      include: { desk: true },
    });
    res.json(updated);
  } catch (err) { next(err); }
});

// POST /api/sessions/end — end session
router.post('/end', requireAuth, async (req, res, next) => {
  try {
    const session = await prisma.session.findFirst({
      where: { userId: req.user.id, status: { in: ['ACTIVE', 'AWAY'] } },
    });
    if (!session) return res.status(404).json({ error: 'No active session found' });

    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.session.update({
        where: { id: session.id },
        data: { status: 'ENDED', endTime: new Date() },
        include: { desk: true },
      });
      await tx.desk.update({ where: { id: session.deskId }, data: { status: 'FREE' } });
      return s;
    });
    res.json(updated);
  } catch (err) { next(err); }
});

module.exports = router;
