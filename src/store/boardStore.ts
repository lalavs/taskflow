import { create } from 'zustand';

import { Board } from '@/types/board';

interface BoardState {
  x: number;
  y: number;
  zoom: number;

  setPosition: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
  initializeState: (state: Board) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  x: 0,
  y: 0,
  zoom: 1,

  setPosition: (x, y) => set({ x, y }),
  setZoom: (zoom) => set({ zoom }),
  initializeState: (state) => set(state),
}));
