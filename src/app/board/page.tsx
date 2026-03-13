'use client';

import { DndContext } from '@dnd-kit/core';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { BoardCanvas } from './components/BoardCanvas';
import { CardLayer } from './components/CardLayer';

import { usePageActions } from './hooks/usePageActions';

const BoardPage = () => {
  const { handleDragEnd, handleAddCard } = usePageActions();

  return (
    <main className="h-screen w-screen overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-[9999] h-16 bg-gray-50 shadow-sm">
        <Container className="flex h-16 items-center justify-between">
          <Logo />

          <Button className="flex items-center gap-2" onClick={handleAddCard}>
            Add Card
          </Button>
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
