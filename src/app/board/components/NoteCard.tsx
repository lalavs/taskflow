'use client';

import { memo, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';

import { updateNote } from '@/entities/note/api/note.api';

import { useCardStore } from '@/store/cardStore';

import { useDebounce } from '@/hooks/useDebounce';

interface INoteCardProps {
  id: string;
  x: number;
  y: number;
  content: string;
  height: number;
  zoom: number;
  isSelected: boolean;
}

export const NoteCard = memo(({ id, x, y, content, height, zoom, isSelected }: INoteCardProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { attributes, listeners, transform, setNodeRef } = useDraggable({ id });
  const debounce = useDebounce(500);

  const updateCard = useCardStore((state) => state.updateCard);
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

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    const newContent = textarea.value;
    const newHeight = textarea.scrollHeight;

    textarea.style.height = 'auto';
    textarea.style.height = `${newHeight}px`;

    updateCard(id, { content: newContent, height: newHeight });

    debounce(() => {
      const current = useCardStore.getState().cards.find((c) => c.id === id);

      if (!current) return;

      updateNote(id, current);
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      suppressHydrationWarning
      className={clsx(
        'p-7 rounded-md shadow cursor-move transition-shadow duration-200',
        isSelected ? 'ring-2 ring-blue-400 bg-orange-100' : 'bg-orange-200',
      )}
      onClick={onNoteClick}
    >
      <textarea
        ref={textareaRef}
        value={content}
        className="bg-transparent resize-none focus:outline-none text-gray-800 text-sm h-auto [&::-webkit-scrollbar]:hidden"
        style={{ height }}
        placeholder="Add text"
        spellCheck={false}
        onClick={onNoteClick}
        onChange={onChange}
        onPointerDownCapture={(e) => e.stopPropagation()}
      />
    </div>
  );
});
