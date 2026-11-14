/** @jest-environment node */

import { DELETE, PATCH } from '@/app/api/notes/[id]/route';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NoteContent } from '@/types/notes';

jest.mock('@/lib/auth', () => ({ auth: jest.fn() }));
jest.mock('@/lib/db', () => ({ prisma: { note: { upsert: jest.fn(), delete: jest.fn() } } }));

const mockedAuth = jest.mocked(auth);
const mockedUpsert = jest.mocked(prisma.note.upsert);
const mockedDelete = jest.mocked(prisma.note.delete);

const body: NoteContent = { x: 10, y: 20, content: 'Updated', height: 120 };
const stored = { id: 'note-1', userId: 'user-1', ...body };
const session = { user: { id: 'user-1' }, expires: '2099-01-01' };
const params = { params: Promise.resolve({ id: 'note-1' }) };

const patchRequest = (payload: unknown) => ({ json: async () => payload }) as unknown as Request;

describe('PATCH /api/notes/[id]', () => {
  it('upserts the note with the session user as owner', async () => {
    mockedAuth.mockResolvedValue(session);
    mockedUpsert.mockResolvedValue(stored);

    const response = await PATCH(patchRequest(body), params);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(stored);
    expect(mockedUpsert).toHaveBeenCalledWith({
      where: { id: 'note-1' },
      update: body,
      create: { id: 'note-1', ...body, userId: 'user-1' },
    });
  });

  it('rejects an anonymous request', async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await PATCH(patchRequest(body), params);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
    expect(mockedUpsert).not.toHaveBeenCalled();
  });

  it('reports a database failure as a server error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAuth.mockResolvedValue(session);
    mockedUpsert.mockRejectedValue(new Error('db down'));

    const response = await PATCH(patchRequest(body), params);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Failed to update note' });
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});

describe('DELETE /api/notes/[id]', () => {
  const deleteRequest = {} as Request;

  it('deletes the note', async () => {
    mockedAuth.mockResolvedValue(session);
    mockedDelete.mockResolvedValue(stored);

    const response = await DELETE(deleteRequest, params);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mockedDelete).toHaveBeenCalledWith({ where: { id: 'note-1' } });
  });

  it('rejects an anonymous request', async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await DELETE(deleteRequest, params);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it('reports a database failure as a server error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAuth.mockResolvedValue(session);
    mockedDelete.mockRejectedValue(new Error('db down'));

    const response = await DELETE(deleteRequest, params);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Failed to delete note' });
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
