import { prisma } from '@/lib/db';
import { getBoardView, updateBoardView } from '@/entities/board/model/board.repo';
import { Board } from '@/types/board';

jest.mock('@/lib/db', () => ({ prisma: { boardView: { upsert: jest.fn(), update: jest.fn() } } }));

const mockedUpsert = jest.mocked(prisma.boardView.upsert);
const mockedUpdate = jest.mocked(prisma.boardView.update);

const view = { id: 'view-1', userId: 'user-1', x: 10, y: 20, zoom: 1.5 };

describe('board.repo', () => {
  it('creates the board view on first read', async () => {
    mockedUpsert.mockResolvedValue(view);

    await expect(getBoardView('user-1')).resolves.toEqual(view);
    expect(mockedUpsert).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      update: {},
      create: { userId: 'user-1' },
    });
  });

  it('updates the stored viewport of the user', async () => {
    const data: Board = { x: 1, y: 2, zoom: 3 };
    mockedUpdate.mockResolvedValue({ ...view, ...data });

    await expect(updateBoardView(data, 'user-1')).resolves.toEqual({ ...view, ...data });
    expect(mockedUpdate).toHaveBeenCalledWith({ where: { userId: 'user-1' }, data });
  });
});
