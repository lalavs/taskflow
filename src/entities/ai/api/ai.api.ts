import axios from 'axios';

export const runAI = async (text: string, action: string) => {
  const res = await axios.post('/api/ai', { text, action });

  return res.data.result;
};
