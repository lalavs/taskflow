import axios from 'axios';

import { INoteContent } from '@/types/notes';

export const updateNote = async (id: string, data: INoteContent) => {
  const res = await axios.patch(`/api/notes/${id}`, data);

  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await axios.delete(`/api/notes/${id}`);

  return res.data;
};
