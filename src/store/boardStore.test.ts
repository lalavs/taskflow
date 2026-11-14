import { useBoardStore } from '@/store/boardStore';

describe('boardStore', () => {
  beforeEach(() => {
    useBoardStore.setState({ x: 0, y: 0, zoom: 1 });
  });

  it('updates the viewport position', () => {
    useBoardStore.getState().setPosition(120, -40);

    expect(useBoardStore.getState()).toMatchObject({ x: 120, y: -40, zoom: 1 });
  });

  it('updates zoom without touching the position', () => {
    useBoardStore.getState().setPosition(10, 20);
    useBoardStore.getState().setZoom(1.5);

    expect(useBoardStore.getState()).toMatchObject({ x: 10, y: 20, zoom: 1.5 });
  });

  it('restores a saved board view', () => {
    useBoardStore.getState().initializeState({ x: 5, y: 15, zoom: 0.8 });

    expect(useBoardStore.getState()).toMatchObject({ x: 5, y: 15, zoom: 0.8 });
  });
});
