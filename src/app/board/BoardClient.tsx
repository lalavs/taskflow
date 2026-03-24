'use client';

import { useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { BoardCanvas } from './components/BoardCanvas';
import { CardLayer } from './components/CardLayer';

import { useCardStore } from '@/store/cardStore';
import { useBoardStore } from '@/store/boardStore';

import { usePageActions } from './hooks/usePageActions';

import { INote } from '@/interfaces/notes';
import { IBoard } from '@/interfaces/board';

interface IBoardClientProps {
  initialNotes: INote[];
  initialView: IBoard;
}

const BoardClient = ({ initialNotes, initialView }: IBoardClientProps) => {
  const setCards = useCardStore((state) => state.setCards);
  const initializeState = useBoardStore((state) => state.initializeState);

  const { handleDragEnd, handleAddCard } = usePageActions();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  useEffect(() => {
    setCards(initialNotes);
    initializeState(initialView);
  }, [initialNotes, initialView, setCards, initializeState]);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-9999 h-16 bg-gray-50 shadow-sm">
        <Container className="flex h-16 items-center justify-between">
          <Logo />

          <Button onClick={handleAddCard}>Add Card</Button>
        </Container>
      </header>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <BoardCanvas>
          <CardLayer />
        </BoardCanvas>
      </DndContext>
    </main>
  );
};

export default BoardClient;
