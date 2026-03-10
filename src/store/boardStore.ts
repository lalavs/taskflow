import { create } from 'zustand';

interface BoardState {
  x: number;
  y: number;
  zoom: number;

  setPosition: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  x: 0,
  y: 0,
  zoom: 1,

  setPosition: (x, y) => set({ x, y }),
  setZoom: (zoom) => set({ zoom }),
}));
