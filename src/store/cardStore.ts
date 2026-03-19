import { create } from 'zustand';

import { INote } from '@/interfaces/notes';

interface ICardState {
  cards: INote[];
  selectedCardId: string | null;

  addCard: (card: INote) => void;
  moveCard: (id: string, x: number, y: number) => void;
  updateCardContent: (id: string, content: string) => void;
  setSelectedCardId: (id: string | null) => void;
  deleteCard: (id: string) => void;
}

export const useCardStore = create<ICardState>((set) => ({
  cards: [],
  selectedCardId: null,

  addCard: (card) =>
    set((state) => ({
      cards: [...state.cards, card],
    })),
  moveCard: (id, x, y) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, x, y } : card)),
    })),
  updateCardContent: (id, content) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, content } : card)),
    })),
  setSelectedCardId: (id) => set({ selectedCardId: id }),
  deleteCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
      selectedCardId: state.selectedCardId === id ? null : state.selectedCardId,
    })),
}));
