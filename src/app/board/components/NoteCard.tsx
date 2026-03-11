'use client';

import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';

interface INoteCardProps {
  id: string;
  x: number;
  y: number;
  content: string;
  zoom: number;
}

export const NoteCard = memo(({ id, x, y, content, zoom }: INoteCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    position: 'absolute' as const,
    left: x,
    top: y,
    transform: transform ? `translate(${transform.x / zoom}px, ${transform.y / zoom}px)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      suppressHydrationWarning
      className="w-48 p-4 bg-yellow-200 rounded shadow cursor-move"
    >
      {content}
    </div>
  );
});
