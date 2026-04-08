import { prisma } from '@/lib/db';

export const getAllNotes = async (userId: string) => {
  return prisma.note.findMany({
    where: { userId },
  });
};
