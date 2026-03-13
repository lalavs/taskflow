'use client';

import { NoteCard } from './NoteCard';

import { useCardStore } from '@/store/cardStore';
import { useBoardStore } from '@/store/boardStore';

export const CardLayer = () => {
  const zoom = useBoardStore((state) => state.zoom);

  const cards = useCardStore((state) => state.cards);
  const selectedCardId = useCardStore((state) => state.selectedCardId);

  return (
    <>
      {cards.map((card) => (
        <NoteCard key={card.id} zoom={zoom} isSelected={card.id === selectedCardId} {...card} />
      ))}
    </>
  );
};
