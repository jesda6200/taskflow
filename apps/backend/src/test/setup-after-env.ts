import { execSync } from 'node:child_process';
import path from 'node:path';
import { prisma } from '../lib/prisma';

const backendRoot = path.resolve(__dirname, '../..');

beforeAll(() => {
  execSync('pnpm exec prisma db push --force-reset --skip-generate', {
    stdio: 'ignore',
    cwd: backendRoot,
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || 'file:./test.db'
    }
  });
});

afterEach(async () => {
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
