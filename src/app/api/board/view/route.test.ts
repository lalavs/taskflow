/** @jest-environment node */

import { GET, PATCH } from '@/app/api/board/view/route';
import { getBoardView, updateBoardView } from '@/entities/board/model/board.repo';
import { auth } from '@/lib/auth';
import { Board } from '@/types/board';

jest.mock('@/lib/auth', () => ({ auth: jest.fn() }));
jest.mock('@/entities/board/model/board.repo', () => ({ getBoardView: jest.fn(), updateBoardView: jest.fn() }));

const mockedAuth = jest.mocked(auth);
const mockedGetBoardView = jest.mocked(getBoardView);
const mockedUpdateBoardView = jest.mocked(updateBoardView);

const view = { id: 'view-1', userId: 'user-1', x: 10, y: 20, zoom: 1.5 };
const session = { user: { id: 'user-1' }, expires: '2099-01-01' };

const patchRequest = (body: Board) => ({ json: async () => body }) as unknown as Request;

describe('GET /api/board/view', () => {
  it('returns the saved board view', async () => {
    mockedAuth.mockResolvedValue(session);
    mockedGetBoardView.mockResolvedValue(view);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(view);
    expect(mockedGetBoardView).toHaveBeenCalledWith('user-1');
  });

  it('rejects an anonymous request', async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('reports a repository failure as a server error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAuth.mockResolvedValue(session);
    mockedGetBoardView.mockRejectedValue(new Error('db down'));

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Failed to fetch board view' });
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});

describe('PATCH /api/board/view', () => {
  it('stores the whole board view for the session user', async () => {
    const body: Board = { x: 5, y: 6, zoom: 2 };
    mockedAuth.mockResolvedValue(session);
    mockedUpdateBoardView.mockResolvedValue({ ...view, ...body });

    const response = await PATCH(patchRequest(body));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ...view, ...body });
    expect(mockedUpdateBoardView).toHaveBeenCalledWith(body, 'user-1');
  });

  it('rejects an anonymous request', async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await PATCH(patchRequest({ x: 1, y: 2, zoom: 3 }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
    expect(mockedUpdateBoardView).not.toHaveBeenCalled();
  });

  it('reports a repository failure as a server error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAuth.mockResolvedValue(session);
    mockedUpdateBoardView.mockRejectedValue(new Error('db down'));

    const response = await PATCH(patchRequest({ x: 1, y: 2, zoom: 3 }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Failed to update board view' });
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
