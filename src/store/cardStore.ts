import { create } from 'zustand';

export interface ICard {
  id: string;
  x: number;
  y: number;
  content: string;
}

interface ICardState {
  cards: ICard[];
  addCard: (card: ICard) => void;
  moveCard: (id: string, x: number, y: number) => void;
}

export const useCardStore = create<ICardState>((set) => ({
  cards: [
    {
      id: '1',
      x: 200,
      y: 200,
      content: 'First note',
    },
  ],

  addCard: (card) =>
    set((state) => ({
      cards: [...state.cards, card],
    })),
  moveCard: (id, x, y) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, x, y } : card)),
    })),
}));
