const prisma = require('../src/db/prisma');
const seedPosts = require('../src/data/postSeed');

async function main() {
  // Ensure default author user exists for the seeded posts
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'Default Author' },
  });

  for (const post of seedPosts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        body: post.body,
        authorId: post.authorId,
      },
      create: {
        id: post.id,
        title: post.title,
        body: post.body,
        authorId: post.authorId,
      },
    });
  }

  // Synchronize Postgres serial sequences with current max(id)
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id), 1)) FROM "User";`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Post"', 'id'), coalesce(max(id), 1)) FROM "Post";`
  );

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
