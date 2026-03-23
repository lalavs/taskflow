import BoardClient from './BoardClient';

import { getAllNotes } from '@/entities/note/model/note.repo';

const BoardPage = async () => {
  const notes = await getAllNotes();

  return <BoardClient initialNotes={notes} />;
};

export default BoardPage;
