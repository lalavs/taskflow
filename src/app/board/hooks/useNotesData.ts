import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useCardStore } from '@/store/cardStore';

import { getNotes, updateNote, deleteNote } from '@/services/notes';

import { INoteContent } from '@/interfaces/notes';

export const useNotesData = () => {
  const cards = useCardStore((state) => state.cards);
  const setCards = useCardStore((state) => state.setCards);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: INoteContent }) => updateNote(id, data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
  });

  useEffect(() => {
    if (data && !cards.length) {
      setCards(data);
    }
  }, [data, setCards]);

  return {
    isLoading,
    isError,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
};
