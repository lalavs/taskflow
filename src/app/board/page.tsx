import BoardClient from './BoardClient';

import { getAllNotes } from '@/entities/note/model/note.repo';
import { getBoardView } from '@/entities/board/model/board.repo';

const BoardPage = async () => {
  const notes = await getAllNotes();
  const view = await getBoardView();

  return <BoardClient initialNotes={notes} initialView={view} />;
};

export default BoardPage;
