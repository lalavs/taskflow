/** @jest-environment node */

import { GET, POST } from '@/app/api/auth/[...nextauth]/route';
import { authOptions } from '@/lib/auth';

jest.mock('next-auth', () => {
  const mockCalls: unknown[][] = [];
  const nextAuth = jest.fn((...args: unknown[]) => {
    mockCalls.push(args);

    return 'next-auth-handler';
  });

  return { __esModule: true, default: nextAuth, mockCalls };
});
jest.mock('@/lib/auth', () => ({ authOptions: { session: { strategy: 'jwt' } } }));

const { mockCalls } = jest.requireMock<{ mockCalls: unknown[][] }>('next-auth');

describe('NextAuth route', () => {
  it('builds a single handler wired to the auth options', () => {
    expect(mockCalls[0]?.[0]).toBe(authOptions);
    expect(GET).toBe('next-auth-handler');
    expect(POST).toBe('next-auth-handler');
  });
});
