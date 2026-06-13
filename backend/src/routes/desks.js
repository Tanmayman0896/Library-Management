const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const desks = await prisma.desk.findMany({
      orderBy: [{ wing: 'asc' }, { col: 'asc' }, { row: 'asc' }],
      include: {
        sessions: {
          where: { status: { in: ['ACTIVE', 'AWAY'] } },
          include: { user: { select: { id: true, name: true, email: true } } },
          take: 1,
        },
      },
    });
    res.json(desks);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const desk = await prisma.desk.findUnique({
      where: { id: req.params.id },
      include: {
        sessions: {
          where: { status: { in: ['ACTIVE', 'AWAY'] } },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
    if (!desk) return res.status(404).json({ error: 'Desk not found' });
    res.json(desk);
  } catch (err) { next(err); }
});

router.post('/checkin', requireAuth, async (req, res, next) => {
  try {
    const { deskLabel } = req.body;
    if (!deskLabel) return res.status(400).json({ error: 'deskLabel required' });

    const desk = await prisma.desk.findUnique({ where: { label: deskLabel } });
    if (!desk) return res.status(404).json({ error: 'Desk not found' });
    if (desk.status !== 'FREE') return res.status(409).json({ error: `Desk is currently ${desk.status}` });

    const existingSession = await prisma.session.findFirst({
      where: { userId: req.user.id, status: { in: ['ACTIVE', 'AWAY'] } },
    });
    if (existingSession) return res.status(409).json({ error: 'You already have an active session' });

    const session = await prisma.$transaction(async (tx) => {
      const s = await tx.session.create({
        data: { userId: req.user.id, deskId: desk.id, status: 'ACTIVE', lastPingTime: new Date() },
        include: { desk: true, user: { select: { id: true, name: true, email: true } } },
      });
      await tx.desk.update({ where: { id: desk.id }, data: { status: 'OCCUPIED' } });
      return s;
    });

    res.status(201).json(session);
  } catch (err) { next(err); }
});

module.exports = router;
