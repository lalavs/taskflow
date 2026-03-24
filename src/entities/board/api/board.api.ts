import axios from 'axios';

import { IBoard } from '@/interfaces/board';

export const updateBoardView = async (data: IBoard) => {
  const res = await axios.patch('/api/board/view', data);

  return res.data;
};
