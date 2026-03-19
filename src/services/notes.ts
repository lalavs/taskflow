import axios from 'axios';

export const getNotes = async () => {
  const res = await axios.get('/api/notes');

  return res.data;
};

export const saveNotes = async (notes: any[]) => {
  const res = await axios.post('/api/notes', { notes });

  return res.data;
};
