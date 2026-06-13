const cron = require('node-cron');
const prisma = require('../db');

const AWAY_TIMEOUT_MS = (parseInt(process.env.AWAY_TIMEOUT_MINUTES) || 20) * 60 * 1000;
const PING_TIMEOUT_MS = (parseInt(process.env.PING_TIMEOUT_HOURS) || 2) * 60 * 60 * 1000;

async function sweep() {
  const now = new Date();

  try {
    const awayDeadline = new Date(now.getTime() - AWAY_TIMEOUT_MS);
    const expiredAway = await prisma.session.findMany({
      where: { status: 'AWAY', awayStartTime: { lte: awayDeadline } },
      select: { id: true, deskId: true },
    });

    for (const s of expiredAway) {
      await prisma.$transaction([
        prisma.session.update({ where: { id: s.id }, data: { status: 'ABANDONED', endTime: now } }),
        prisma.desk.update({ where: { id: s.deskId }, data: { status: 'ABANDONED' } }),
      ]);
      console.log(`[sweep] Session ${s.id} abandoned (away timeout exceeded)`);
    }

    const pingDeadline = new Date(now.getTime() - PING_TIMEOUT_MS);
    const expiredActive = await prisma.session.findMany({
      where: { status: 'ACTIVE', lastPingTime: { lte: pingDeadline } },
      select: { id: true, deskId: true },
    });

    for (const s of expiredActive) {
      await prisma.$transaction([
        prisma.session.update({ where: { id: s.id }, data: { status: 'ABANDONED', endTime: now } }),
        prisma.desk.update({ where: { id: s.deskId }, data: { status: 'ABANDONED' } }),
      ]);
      console.log(`[sweep] Session ${s.id} abandoned (ping timeout exceeded)`);
    }

    if (expiredAway.length + expiredActive.length > 0) {
      console.log(`[sweep] ${now.toISOString()} — expired ${expiredAway.length} away, ${expiredActive.length} active`);
    }
  } catch (err) {
    console.error('[sweep] Error during sweep:', err);
  }
}

function startSweepJob() {
  cron.schedule('* * * * *', sweep);
  console.log('[sweep] Background sweep job started (runs every minute)');
  sweep();
}

module.exports = { startSweepJob, sweep };
