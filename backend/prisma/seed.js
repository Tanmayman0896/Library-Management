const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Generate all desk labels matching the actual map layout
const desks = [];

// ── LEFT WING ──────────────────────────────────────────────────────────
// PC desks: LW-01 .. LW-30 (5 cols × 6 rows)
for (let col = 0; col < 5; col++) {
  for (let row = 0; row < 6; row++) {
    desks.push({ label: `LW-${String(col * 6 + row + 1).padStart(2, '0')}`, wing: 'LEFT', type: 'PC', row, col });
  }
}
// Study desks: LS-01 .. LS-12
for (let i = 0; i < 12; i++) {
  desks.push({ label: `LS-${String(i + 1).padStart(2, '0')}`, wing: 'LEFT', type: 'STUDY', row: i, col: 5 });
}
// Cubicles: LC-01 .. LC-08
for (let i = 0; i < 8; i++) {
  desks.push({ label: `LC-${String(i + 1).padStart(2, '0')}`, wing: 'LEFT', type: 'CUBICLE', row: i, col: 6 });
}

// ── RIGHT WING ─────────────────────────────────────────────────────────
// PC desks: RW-01 .. RW-30
for (let col = 0; col < 5; col++) {
  for (let row = 0; row < 6; row++) {
    desks.push({ label: `RW-${String(col * 6 + row + 1).padStart(2, '0')}`, wing: 'RIGHT', type: 'PC', row, col });
  }
}
// Study desks: RS-01 .. RS-12
for (let i = 0; i < 12; i++) {
  desks.push({ label: `RS-${String(i + 1).padStart(2, '0')}`, wing: 'RIGHT', type: 'STUDY', row: i, col: 5 });
}
// Cubicles: RC-01 .. RC-08
for (let i = 0; i < 8; i++) {
  desks.push({ label: `RC-${String(i + 1).padStart(2, '0')}`, wing: 'RIGHT', type: 'CUBICLE', row: i, col: 6 });
}

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.session.deleteMany();
  await prisma.desk.deleteMany();
  await prisma.user.deleteMany();

  // Create desks
  for (const desk of desks) {
    await prisma.desk.create({ data: desk });
  }
  console.log(`Created ${desks.length} desks`);

  // Create librarian account
  const librarianPw = await bcrypt.hash('librarian123', 10);
  await prisma.user.create({
    data: { email: 'librarian@muj.ac.in', password: librarianPw, name: 'Library Admin', role: 'LIBRARIAN' },
  });

  // Create a sample student
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
