// tests/jest.setup.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  // Truncate all tables except migrations
  const tables = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;

  for (const { tablename } of tables) {
    if (tablename === "_prisma_migrations") continue;
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`
    );
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
