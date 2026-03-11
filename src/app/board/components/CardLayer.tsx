'use client';

import { NoteCard } from './NoteCard';

import { useCardStore } from '@/store/cardStore';
import { useBoardStore } from '@/store/boardStore';

export const CardLayer = () => {
  const cards = useCardStore((state) => state.cards);
  const zoom = useBoardStore((state) => state.zoom);

  return (
    <>
      {cards.map((card) => (
        <NoteCard key={card.id} zoom={zoom} {...card} />
      ))}
    </>
  );
};
