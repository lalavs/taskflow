import { useBoardStore } from '@/store/boardStore';
import { useCardStore } from '@/store/cardStore';
import { DragEndEvent } from '@dnd-kit/core';
import { useCallback, useEffect } from 'react';

export const usePageActions = () => {
  const x = useBoardStore((state) => state.x);
  const y = useBoardStore((state) => state.y);
  const zoom = useBoardStore((state) => state.zoom);

  const moveCard = useCardStore((state) => state.moveCard);
  const addCard = useCardStore((state) => state.addCard);
  const deleteCard = useCardStore((state) => state.deleteCard);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;

      const card = useCardStore.getState().cards.find((c) => c.id === active.id);

      if (!card) return;

      const { zoom: currentZoom } = useBoardStore.getState();

      moveCard(card.id, card.x + delta.x / currentZoom, card.y + delta.y / currentZoom);
    },
    [moveCard],
  );

  const handleAddCard = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const cardSize = 192;

    const boardX = (centerX - x) / zoom - cardSize / 2;
    const boardY = (centerY - y) / zoom - cardSize / 2;

    addCard({
      id: Date.now().toString(),
      x: boardX,
      y: boardY,
      content: '',
    });
  }, [x, y, zoom, addCard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement instanceof HTMLTextAreaElement) return;

        const selectedId = useCardStore.getState().selectedCardId;

        if (selectedId) {
          deleteCard(selectedId);
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
