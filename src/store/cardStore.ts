import { create } from 'zustand';

import { Note } from '@/types/notes';

interface CardState {
  cards: Note[];
  selectedCardId: string | null;

  addCard: (card: Note) => void;
  setCards: (cards: Note[]) => void;
  moveCard: (id: string, x: number, y: number) => void;
  updateCard: (id: string, updates: Partial<Note>) => void;
  setSelectedCardId: (id: string | null) => void;
  deleteCard: (id: string) => void;
}

export const useCardStore = create<CardState>((set) => ({
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
