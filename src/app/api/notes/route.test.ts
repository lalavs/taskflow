/** @jest-environment node */

import { GET } from '@/app/api/notes/route';
import { getAllNotes } from '@/entities/note/model/note.repo';
import { auth } from '@/lib/auth';

jest.mock('@/lib/auth', () => ({ auth: jest.fn() }));
jest.mock('@/entities/note/model/note.repo', () => ({ getAllNotes: jest.fn() }));

const mockedAuth = jest.mocked(auth);
const mockedGetAllNotes = jest.mocked(getAllNotes);

const note = { id: 'note-1', userId: 'user-1', x: 0, y: 0, content: 'First', height: 96 };
const session = { user: { id: 'user-1' }, expires: '2099-01-01' };

describe('GET /api/notes', () => {
  it('returns the notes of the session user', async () => {
    mockedAuth.mockResolvedValue(session);
    mockedGetAllNotes.mockResolvedValue([note]);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([note]);
    expect(mockedGetAllNotes).toHaveBeenCalledWith('user-1');
  });

  it('rejects an anonymous request', async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
    expect(mockedGetAllNotes).not.toHaveBeenCalled();
  });

  it('reports a database failure as a server error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAuth.mockResolvedValue(session);
    mockedGetAllNotes.mockRejectedValue(new Error('db down'));

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Failed to fetch notes' });
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
