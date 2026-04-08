import { redirect } from 'next/navigation';

import BoardClient from './BoardClient';

import { auth } from '@/lib/auth';

import { getAllNotes } from '@/entities/note/model/note.repo';
import { getBoardView } from '@/entities/board/model/board.repo';

const BoardPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const notes = await getAllNotes(session.user.id);
  const view = await getBoardView(session.user.id);

  return <BoardClient initialNotes={notes} initialView={view} />;
};

export default BoardPage;
