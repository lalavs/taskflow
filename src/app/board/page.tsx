'use client';

import { DndContext } from '@dnd-kit/core';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { BoardCanvas } from './components/BoardCanvas';
import { CardLayer } from './components/CardLayer';

import { usePageActions } from './hooks/usePageActions';
import { useNotesData } from './hooks/useNotesData';

const BoardPage = () => {
  const { handleDragEnd, handleAddCard } = usePageActions();

  const { save } = useNotesData();

  return (
    <main className="h-screen w-screen overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-9999 h-16 bg-gray-50 shadow-sm">
        <Container className="flex h-16 items-center justify-between">
          <Logo />

          <div className="flex gap-3">
            <Button onClick={handleAddCard}>Add Card</Button>

            {/* temporary, autosave later */}
            <Button onClick={() => save()}>Save</Button>
          </div>
        </Container>
      </header>

      <DndContext onDragEnd={handleDragEnd}>
        <BoardCanvas>
          <CardLayer />
        </BoardCanvas>
      </DndContext>
    </main>
  );
};

export default BoardPage;
