import { prisma } from '@/lib/db';

import { IBoard } from '@/interfaces/board';

export const getBoardView = async () => {
  return await prisma.boardView.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
    },
  });
};

export const updateBoardView = async (data: IBoard) => {
  return prisma.boardView.update({
    where: { id: 'default' },
    data,
  });
};
