const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const desks = [];

for (let i = 1; i <= 14; i++) {
  desks.push({ label: `PC ${i}`, wing: 'LEFT', type: 'PC', row: ((i-1) % 7), col: Math.floor((i-1) / 7) });
}
for (let i = 1; i <= 28; i++) {
  desks.push({ label: String(i).padStart(2, '0'), wing: 'LEFT', type: 'DESK', row: ((i-1) % 7), col: Math.floor((i-1) / 7) });
}
for (let i = 1; i <= 18; i++) {
  desks.push({ label: `Cubicle ${String(i).padStart(2, '0')}`, wing: 'LEFT', type: 'CUBICLE', row: ((i-1) % 3), col: Math.floor((i-1) / 3) });
}
const leftStudyRooms = [
  { room: 1, labels: ['L-SR1-SD1','L-SR1-SD2','L-SR1-SD3'] },
  { room: 2, labels: ['L-SR2-SD1','L-SR2-SD2','L-SR2-SD3'] },
  { room: 3, labels: ['L-SR3-SD1','L-SR3-SD2','L-SR3-SD3'] },
  { room: 4, labels: ['L-SR4-SD1','L-SR4-SD2','L-SR4-SD3'] },
];
leftStudyRooms.forEach(({ room, labels }) => {
  labels.forEach((label, i) => {
    desks.push({ label, wing: 'LEFT', type: 'STUDY_ROOM', row: i, col: room });
  });
});

for (let i = 15; i <= 28; i++) {
  desks.push({ label: `PC ${i}`, wing: 'RIGHT', type: 'PC', row: ((i-15) % 7), col: Math.floor((i-15) / 7) });
}
for (let i = 29; i <= 56; i++) {
  desks.push({ label: String(i).padStart(2, '0'), wing: 'RIGHT', type: 'DESK', row: ((i-29) % 7), col: Math.floor((i-29) / 7) });
}
for (let i = 19; i <= 36; i++) {
  desks.push({ label: `Cubicle ${String(i).padStart(2, '0')}`, wing: 'RIGHT', type: 'CUBICLE', row: ((i-19) % 3), col: Math.floor((i-19) / 3) });
}
const rightStudyRooms = [
  { room: 5, labels: ['R-SR5-SD1','R-SR5-SD2','R-SR5-SD3'] },
  { room: 6, labels: ['R-SR6-SD1','R-SR6-SD2','R-SR6-SD3'] },
];
rightStudyRooms.forEach(({ room, labels }) => {
  labels.forEach((label, i) => {
    desks.push({ label, wing: 'RIGHT', type: 'STUDY_ROOM', row: i, col: room });
  });
});

async function main() {
  console.log('Seeding database...');
  await prisma.session.deleteMany();
  await prisma.desk.deleteMany();
  await prisma.user.deleteMany();

  for (const desk of desks) {
    await prisma.desk.create({ data: desk });
  }
  console.log(`Created ${desks.length} desks`);

  const librarianPw = await bcrypt.hash('librarian123', 10);
  await prisma.user.create({
    data: { email: 'librarian@muj.ac.in', password: librarianPw, name: 'Library Admin', role: 'LIBRARIAN' },
  });

  const studentPw = await bcrypt.hash('student123', 10);
  await prisma.user.create({
    data: { email: 'student@muj.ac.in', password: studentPw, name: 'Test Student', role: 'STUDENT' },
  });

  console.log('Seeded users: librarian@muj.ac.in / librarian123, student@muj.ac.in / student123');
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());