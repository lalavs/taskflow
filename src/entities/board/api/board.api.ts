import axios from 'axios';

import { Board } from '@/types/board';

export const updateBoardView = async (data: Board) => {
  const res = await axios.patch('/api/board/view', data);

  return res.data;
};
