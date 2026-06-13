const express = require('express');
const prisma = require('../db');
const { requireLibrarian } = require('../middleware/auth');

const router = express.Router();

router.get('/abandoned', requireLibrarian, async (req, res, next) => {
  try {
    const desks = await prisma.desk.findMany({
      where: { status: 'ABANDONED' },
      include: {
        sessions: {
          where: { status: 'ABANDONED' },
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { startTime: 'desc' },
          take: 1,
        },
      },
    });
    res.json(desks);
  } catch (err) { next(err); }
});

router.get('/desks', requireLibrarian, async (req, res, next) => {
  try {
    const desks = await prisma.desk.findMany({
      orderBy: [{ wing: 'asc' }, { label: 'asc' }],
      include: {
        sessions: {
          where: { status: { in: ['ACTIVE', 'AWAY', 'ABANDONED'] } },
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { startTime: 'desc' },
          take: 1,
        },
      },
    });
    res.json(desks);
  } catch (err) { next(err); }
});

router.post('/reset/:deskId', requireLibrarian, async (req, res, next) => {
  try {
    const desk = await prisma.desk.findUnique({ where: { id: req.params.deskId } });
    if (!desk) return res.status(404).json({ error: 'Desk not found' });

    await prisma.$transaction(async (tx) => {
      await tx.session.updateMany({
        where: { deskId: desk.id, status: { in: ['ACTIVE', 'AWAY', 'ABANDONED'] } },
        data: { status: 'ENDED', endTime: new Date() },
      });
      await tx.desk.update({ where: { id: desk.id }, data: { status: 'FREE' } });
    });

    res.json({ message: `Desk ${desk.label} has been reset to FREE` });
  } catch (err) { next(err); }
});

router.get('/stats', requireLibrarian, async (req, res, next) => {
  try {
    const [total, free, occupied, away, abandoned] = await Promise.all([
      prisma.desk.count(),
      prisma.desk.count({ where: { status: 'FREE' } }),
      prisma.desk.count({ where: { status: 'OCCUPIED' } }),
      prisma.desk.count({ where: { status: 'AWAY' } }),
      prisma.desk.count({ where: { status: 'ABANDONED' } }),
    ]);
    res.json({ total, free, occupied, away, abandoned, occupancyRate: Math.round(((occupied + away) / total) * 100) });
  } catch (err) { next(err); }
});

module.exports = router;
