import { prisma } from '@/lib/db';
import { getAllNotes } from '@/entities/note/model/note.repo';

jest.mock('@/lib/db', () => ({ prisma: { note: { findMany: jest.fn() } } }));

const mockedFindMany = jest.mocked(prisma.note.findMany);

const note = { id: 'note-1', userId: 'user-1', x: 0, y: 0, content: 'First', height: 96 };

describe('note.repo', () => {
  it('loads only the notes owned by the user', async () => {
    mockedFindMany.mockResolvedValue([note]);

    await expect(getAllNotes('user-1')).resolves.toEqual([note]);
    expect(mockedFindMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
  });
});
