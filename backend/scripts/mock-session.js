const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.user.findUnique({ where: { email: 'student@muj.ac.in' } });
  const desk = await prisma.desk.findUnique({ where: { label: 'LW-05' } });

  await prisma.session.updateMany({
    where: { userId: student.id, status: { in: ['ACTIVE', 'AWAY'] } },
    data: { status: 'ENDED', endTime: new Date() },
  });
  await prisma.desk.update({ where: { id: desk.id }, data: { status: 'OCCUPIED' } });

  const startTime = new Date(Date.now() - 37 * 60 * 1000);
  const s = await prisma.session.create({
    data: { userId: student.id, deskId: desk.id, status: 'ACTIVE', startTime, lastPingTime: new Date() },
    include: { desk: true },
  });

  console.log('Mock session created:', s.id, '| Desk:', s.desk.label, '| Started 37min ago');
}

main().catch(console.error).finally(() => prisma.$disconnect());
