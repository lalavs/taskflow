import { prisma } from '@/lib/db';

export const getAllNotes = async () => {
  return prisma.note.findMany();
};
