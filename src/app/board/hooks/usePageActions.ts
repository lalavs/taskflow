import { useCallback, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';

import { useBoardStore } from '@/store/boardStore';
import { useCardStore } from '@/store/cardStore';

import { useNotesData } from './useNotesData';

export const usePageActions = () => {
  const x = useBoardStore((state) => state.x);
  const y = useBoardStore((state) => state.y);
  const zoom = useBoardStore((state) => state.zoom);

  const moveCard = useCardStore((state) => state.moveCard);
  const addCard = useCardStore((state) => state.addCard);
  const deleteCard = useCardStore((state) => state.deleteCard);

  const { update, remove } = useNotesData();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;

      const card = useCardStore.getState().cards.find((c) => c.id === active.id);

      if (!card) return;

      const { zoom } = useBoardStore.getState();

      const newX = card.x + delta.x / zoom;
      const newY = card.y + delta.y / zoom;

      moveCard(card.id, newX, newY);

      update({
        id: card.id,
        data: {
          x: newX,
          y: newY,
          content: card.content,
        },
      });
    },
    [moveCard],
  );

  const handleAddCard = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const cardSize = 192;

    const boardX = (centerX - x) / zoom - cardSize / 2;
    const boardY = (centerY - y) / zoom - cardSize / 2;

    const newCard = {
      id: uuidv4(),
      x: boardX,
      y: boardY,
      content: '',
    };

    addCard(newCard);

    update({
      id: newCard.id,
      data: newCard,
    });
  }, [x, y, zoom, addCard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement instanceof HTMLTextAreaElement) return;

        const selectedId = useCardStore.getState().selectedCardId;

        if (selectedId) {
          deleteCard(selectedId);

          remove(selectedId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteCard]);

  return {
    handleDragEnd,
    handleAddCard,
  };
};
