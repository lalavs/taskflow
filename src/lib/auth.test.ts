import { getServerSession } from 'next-auth';

import { auth, authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('next-auth/providers/google', () => {
  const mockCalls: unknown[][] = [];
  const googleProvider = jest.fn((...args: unknown[]) => {
    mockCalls.push(args);

    return { id: 'google', name: 'Google' };
  });

  return { __esModule: true, default: googleProvider, mockCalls };
});
jest.mock('@/lib/db', () => ({ prisma: { user: { findUnique: jest.fn(), create: jest.fn() } } }));

const { mockCalls: googleProviderCalls } = jest.requireMock<{ mockCalls: unknown[][] }>('next-auth/providers/google');
const mockedGetServerSession = jest.mocked(getServerSession);
const mockedFindUnique = jest.mocked(prisma.user.findUnique);
const mockedCreate = jest.mocked(prisma.user.create);

type DbUser = NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;

const dbUser = { id: 'db-user-1', email: 'ada@example.com', name: 'Ada', image: null } as unknown as DbUser;

const getJwtCallback = () => {
  const callback = authOptions.callbacks?.jwt;
  if (!callback) {
    throw new Error('jwt callback is missing');
  }

  return callback;
};

const getSessionCallback = () => {
  const callback = authOptions.callbacks?.session;
  if (!callback) {
    throw new Error('session callback is missing');
  }

  return callback;
};

describe('authOptions', () => {
  it('configures Google login with JWT sessions', () => {
    expect(authOptions.session).toEqual({ strategy: 'jwt' });
    expect(authOptions.pages).toEqual({ signIn: '/' });
    expect(authOptions.providers).toHaveLength(1);
    expect(googleProviderCalls[0]?.[0]).toEqual({ clientId: expect.any(String), clientSecret: expect.any(String) });
  });

  it('reuses the database user id for an existing account', async () => {
    mockedFindUnique.mockResolvedValue(dbUser);

    const token = await getJwtCallback()({
      token: { name: 'Ada' },
      user: { id: 'google-1', name: 'Ada', email: 'ada@example.com', image: null },
    } as Parameters<ReturnType<typeof getJwtCallback>>[0]);

    expect(mockedFindUnique).toHaveBeenCalledWith({ where: { email: 'ada@example.com' } });
    expect(mockedCreate).not.toHaveBeenCalled();
    expect(token.id).toBe('db-user-1');
  });

  it('creates a database user on the first sign-in', async () => {
    mockedFindUnique.mockResolvedValue(null);
    mockedCreate.mockResolvedValue({ ...dbUser, id: 'created-1' });

    const token = await getJwtCallback()({
      token: {},
      user: { id: 'google-2', name: 'Bob', email: 'bob@example.com', image: 'avatar.png' },
    } as Parameters<ReturnType<typeof getJwtCallback>>[0]);

    expect(mockedCreate).toHaveBeenCalledWith({ data: { email: 'bob@example.com', name: 'Bob', image: 'avatar.png' } });
    expect(token.id).toBe('created-1');
  });

  it('keeps the token untouched when there is no fresh user', async () => {
    const token = await getJwtCallback()({ token: { sub: 'google-1' } } as Parameters<ReturnType<typeof getJwtCallback>>[0]);

    expect(token).toEqual({ sub: 'google-1' });
    expect(mockedFindUnique).not.toHaveBeenCalled();
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('copies the token id into the exposed session', async () => {
    const session = await getSessionCallback()({
      session: { user: { id: 'stale' }, expires: '2099-01-01' },
      token: { id: 'db-user-1' },
    } as unknown as Parameters<ReturnType<typeof getSessionCallback>>[0]);

    expect(session).toMatchObject({ user: { id: 'db-user-1' } });
  });

  it('leaves a session without a user as is', async () => {
    const session = await getSessionCallback()({
      session: { expires: '2099-01-01' },
      token: { id: 'db-user-1' },
    } as unknown as Parameters<ReturnType<typeof getSessionCallback>>[0]);

    expect(session.user).toBeUndefined();
  });
});

describe('auth', () => {
  it('resolves the server session with the auth options', async () => {
    const session = { user: { id: 'db-user-1' }, expires: '2099-01-01' };
    mockedGetServerSession.mockResolvedValue(session);

    await expect(auth()).resolves.toBe(session);
    expect(mockedGetServerSession).toHaveBeenCalledWith(authOptions);
  });
});
