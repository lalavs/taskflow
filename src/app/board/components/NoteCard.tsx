'use client';

import { memo, useRef, useState, useEffect } from 'react';
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

  const [isEditing, setIsEditing] = useState(false);

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
  };

  const dragListeners = isEditing ? undefined : listeners;

  const onNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCardId(id);
  };

  const onDoubleNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
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

  const onBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing, content]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...dragListeners}
      {...attributes}
      suppressHydrationWarning
      className={clsx(
        'w-72 p-7 rounded-md shadow transition-shadow duration-200 select-none',
        isSelected && 'ring-2 ring-blue-400',
        isEditing ? ' bg-orange-100 cursor-text' : 'bg-orange-200 cursor-move',
      )}
      onClick={onNoteClick}
      onDoubleClick={onDoubleNoteClick}
    >
      <textarea
        ref={textareaRef}
        value={content}
        className={clsx(
          'bg-transparent resize-none focus:outline-none text-gray-800 text-sm w-full [&::-webkit-scrollbar]:hidden',
          !isEditing && 'pointer-events-none',
        )}
        style={{ height }}
        placeholder="Add text"
        spellCheck={false}
        onBlur={onBlur}
        onChange={onChange}
      />
    </div>
  );
});
