import axios from 'axios';

import { INote } from '@/interfaces/notes';

export const getNotes = async () => {
  const res = await axios.get('/api/notes');

  return res.data;
};

export const saveNotes = async (notes: INote[]) => {
  const res = await axios.post('/api/notes', { notes });

  return res.data;
};
