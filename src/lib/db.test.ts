import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

jest.mock('@prisma/client', () => ({ PrismaClient: jest.fn(() => ({ tag: 'client' })) }));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: jest.fn(() => ({ tag: 'adapter' })) }));

const mockedPrismaClient = jest.mocked(PrismaClient);
const mockedPrismaPg = jest.mocked(PrismaPg);

type DbModule = typeof import('@/lib/db');

const loadDbModule = async (): Promise<DbModule> => {
  let loaded: DbModule | undefined;

  await jest.isolateModulesAsync(async () => {
    loaded = await import('@/lib/db');
  });

  if (!loaded) {
    throw new Error('db module was not loaded');
  }

  return loaded;
};

const globalPrisma = globalThis as { prisma?: unknown };

describe('db', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/taskflow';
    delete globalPrisma.prisma;
  });

  afterAll(() => {
    delete process.env.DATABASE_URL;
  });

  it('creates a Prisma client on the pg adapter and caches it globally', async () => {
    const { prisma } = await loadDbModule();

    expect(mockedPrismaPg).toHaveBeenCalledWith({ connectionString: process.env.DATABASE_URL });
    expect(mockedPrismaClient).toHaveBeenCalledWith({ adapter: { tag: 'adapter' } });
    expect(prisma).toEqual({ tag: 'client' });
    expect(globalPrisma.prisma).toBe(prisma);
  });

  it('reuses the client cached on the global object', async () => {
    const first = await loadDbModule();
    const second = await loadDbModule();

    expect(second.prisma).toBe(first.prisma);
    expect(mockedPrismaClient).toHaveBeenCalledTimes(1);
  });
});
