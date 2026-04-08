import { prisma } from '@/lib/db';

import { IBoard } from '@/interfaces/board';

export const getBoardView = async (userId: string) => {
  return await prisma.boardView.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
    },
  });
};

export const updateBoardView = async (data: IBoard, userId: string) => {
  return prisma.boardView.update({
    where: { userId },
    data,
  });
};
