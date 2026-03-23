import { create } from 'zustand';

import { INote } from '@/interfaces/notes';

interface ICardState {
  cards: INote[];
  selectedCardId: string | null;

  addCard: (card: INote) => void;
  setCards: (cards: INote[]) => void;
  moveCard: (id: string, x: number, y: number) => void;
  updateCard: (id: string, updates: Partial<INote>) => void;
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
  setCards: (cards) => set({ cards }),
  moveCard: (id, x, y) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, x, y } : card)),
    })),
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    })),
  setSelectedCardId: (id) => set({ selectedCardId: id }),
  deleteCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
      selectedCardId: state.selectedCardId === id ? null : state.selectedCardId,
    })),
}));
