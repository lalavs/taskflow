import axios from 'axios';

import { NoteContent } from '@/types/notes';

export const updateNote = async (id: string, data: NoteContent) => {
  const res = await axios.patch(`/api/notes/${id}`, data);

  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await axios.delete(`/api/notes/${id}`);

  return res.data;
};
