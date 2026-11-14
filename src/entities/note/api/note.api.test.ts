import axios from 'axios';

import { deleteNote, updateNote } from '@/entities/note/api/note.api';
import { NoteContent } from '@/types/notes';

jest.mock('axios', () => ({ __esModule: true, default: { patch: jest.fn(), delete: jest.fn() } }));

const mockedAxios = jest.mocked(axios);

const content: NoteContent = { x: 10, y: 20, content: 'Updated', height: 120 };

describe('note.api', () => {
  it('patches a note by id', async () => {
    mockedAxios.patch.mockResolvedValue({ data: { id: 'note-1', ...content } });

    await expect(updateNote('note-1', content)).resolves.toEqual({ id: 'note-1', ...content });
    expect(mockedAxios.patch).toHaveBeenCalledWith('/api/notes/note-1', content);
  });

  it('deletes a note by id', async () => {
    mockedAxios.delete.mockResolvedValue({ data: { success: true } });

    await expect(deleteNote('note-1')).resolves.toEqual({ success: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith('/api/notes/note-1');
  });
});
