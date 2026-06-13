const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const desks = [];

for (let col = 0; col < 5; col++) {
  for (let row = 0; row < 6; row++) {
    desks.push({ label: `LW-${String(col * 6 + row + 1).padStart(2, '0')}`, wing: 'LEFT', type: 'PC', row, col });
  }
}
for (let i = 0; i < 12; i++) {
  desks.push({ label: `LS-${String(i + 1).padStart(2, '0')}`, wing: 'LEFT', type: 'STUDY', row: i, col: 5 });
}
for (let i = 0; i < 8; i++) {
  desks.push({ label: `LC-${String(i + 1).padStart(2, '0')}`, wing: 'LEFT', type: 'CUBICLE', row: i, col: 6 });
}

for (let col = 0; col < 5; col++) {
  for (let row = 0; row < 6; row++) {
    desks.push({ label: `RW-${String(col * 6 + row + 1).padStart(2, '0')}`, wing: 'RIGHT', type: 'PC', row, col });
  }
}
for (let i = 0; i < 12; i++) {
  desks.push({ label: `RS-${String(i + 1).padStart(2, '0')}`, wing: 'RIGHT', type: 'STUDY', row: i, col: 5 });
}
for (let i = 0; i < 8; i++) {
  desks.push({ label: `RC-${String(i + 1).padStart(2, '0')}`, wing: 'RIGHT', type: 'CUBICLE', row: i, col: 6 });
}

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

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
