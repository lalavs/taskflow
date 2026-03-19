import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useCardStore } from '@/store/cardStore';

import { getNotes, saveNotes } from '@/services/notes';

import { INote } from '@/interfaces/notes';

export const useNotesData = () => {
  const cards = useCardStore((state) => state.cards);
  const setCards = useCardStore((state) => state.addCard);

  const query = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  });

  const mutation = useMutation({
    mutationFn: () => saveNotes(cards),
  });

  useEffect(() => {
    if (query.data) {
      query.data.forEach((note: INote) => {
        setCards(note);
      }); // temporary
    }
  }, [query.data, setCards]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    isSaving: mutation.isPending,
    save: mutation.mutate,
  };
};
