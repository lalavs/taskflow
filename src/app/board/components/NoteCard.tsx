'use client';

import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';

import { useCardStore } from '@/store/cardStore';

interface INoteCardProps {
  id: string;
  x: number;
  y: number;
  content: string;
  zoom: number;
  isSelected: boolean;
}

export const NoteCard = memo(({ id, x, y, content, zoom, isSelected }: INoteCardProps) => {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({ id });

  const updateCardContent = useCardStore((state) => state.updateCardContent);
  const setSelectedCardId = useCardStore((state) => state.setSelectedCardId);

  const style = {
    position: 'absolute' as const,
    left: x,
    top: y,
    transform: transform ? `translate(${transform.x / zoom}px, ${transform.y / zoom}px)` : undefined,
    willChange: transform ? 'transform' : 'auto',
    zIndex: isSelected ? 10 : 1,
  };

  const onNoteClick = (e: React.MouseEvent | Event) => {
    e.stopPropagation();
    setSelectedCardId(id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      suppressHydrationWarning
      className={clsx(
        'w-48 p-4 rounded-md shadow cursor-move transition-shadow duration-200',
        isSelected ? 'ring-2 ring-blue-400 bg-yellow-100' : 'bg-yellow-200',
      )}
      onClick={onNoteClick}
    >
      <textarea
        value={content}
        className="bg-transparent resize-none focus:outline-none text-gray-800 text-sm"
        placeholder="Add text"
        spellCheck={false}
        onClick={onNoteClick}
        onChange={(e) => updateCardContent(id, e.target.value)}
        onPointerDownCapture={(e) => e.stopPropagation()}
      />
    </div>
  );
});
