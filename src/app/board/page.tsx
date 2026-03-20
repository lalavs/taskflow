'use client';

import { DndContext } from '@dnd-kit/core';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { BoardCanvas } from './components/BoardCanvas';
import { CardLayer } from './components/CardLayer';

import { getNotes } from '@/services/notes';

import { useCardStore } from '@/store/cardStore';

import { usePageActions } from './hooks/usePageActions';
import { useEffect } from 'react';

const BoardPage = () => {
  const setCards = useCardStore((state) => state.setCards);

  const { handleDragEnd, handleAddCard } = usePageActions();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotes();
        setCards(data);
      } catch (e) {
        console.error('Failed to load notes', e);
      }
    };

    load();
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-9999 h-16 bg-gray-50 shadow-sm">
        <Container className="flex h-16 items-center justify-between">
          <Logo />

          <Button onClick={handleAddCard}>Add Card</Button>
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
