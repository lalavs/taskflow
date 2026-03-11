'use client';

import { useCallback } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

import { BoardCanvas } from './components/BoardCanvas';
import { CardLayer } from './components/CardLayer';

import { useCardStore } from '@/store/cardStore';
import { useBoardStore } from '@/store/boardStore';

const BoardPage = () => {
  const moveCard = useCardStore((s) => s.moveCard);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;

      const card = useCardStore.getState().cards.find((c) => c.id === active.id);

      if (!card) return;

      const { zoom } = useBoardStore.getState();

      moveCard(card.id, card.x + delta.x / zoom, card.y + delta.y / zoom);
    },
    [moveCard],
  );

  return (
    <main className="h-screen w-screen overflow-hidden">
      <DndContext onDragEnd={handleDragEnd}>
        <BoardCanvas>
          <CardLayer />
        </BoardCanvas>
      </DndContext>
    </main>
  );
};

export default BoardPage;
