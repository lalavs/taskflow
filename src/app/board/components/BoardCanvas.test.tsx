import { fireEvent, render, screen } from '@testing-library/react';

import { BoardCanvas } from '@/app/board/components/BoardCanvas';
import { useBoardPanZoom } from '../hooks/useBoardPanZoom';
import { useBoardStore } from '@/store/boardStore';
import { useCardStore } from '@/store/cardStore';

jest.mock('../hooks/useBoardPanZoom', () => ({ useBoardPanZoom: jest.fn() }));

const mockedUseBoardPanZoom = jest.mocked(useBoardPanZoom);

const getCanvasParts = (container: HTMLElement) => {
  const outer = container.firstElementChild;
  const grid = outer?.firstElementChild;
  const layer = outer?.children[1];

  if (!(outer instanceof HTMLDivElement) || !(grid instanceof HTMLDivElement) || !(layer instanceof HTMLDivElement)) {
    throw new Error('Board canvas markup is incomplete');
  }

  return { outer, grid, layer };
};

describe('BoardCanvas', () => {
  const handlers = {
    onMouseDown: jest.fn(),
    onMouseMove: jest.fn(),
    onMouseUp: jest.fn(),
    onWheel: jest.fn(),
  };

  beforeEach(() => {
    mockedUseBoardPanZoom.mockReturnValue(handlers);
    useBoardStore.setState({ x: 10, y: -20, zoom: 2 });
    useCardStore.setState({ cards: [], selectedCardId: 'card-1' });
  });

  it('draws the grid and content layer from the board state', () => {
    const { container } = render(
      <BoardCanvas>
        <span>Notes</span>
      </BoardCanvas>,
    );
    const { grid, layer } = getCanvasParts(container);

    expect(grid.style.backgroundPosition).toBe('-10px 20px');
    expect(grid.style.backgroundSize).toBe('80px 80px');
    expect(layer.style.transform).toBe('translate(10px, -20px) scale(2)');
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('forwards pointer and wheel events to the pan-zoom hook', () => {
    const { container } = render(<BoardCanvas />);
    const { grid } = getCanvasParts(container);

    fireEvent.mouseDown(grid);
    fireEvent.mouseMove(grid);
    fireEvent.mouseUp(grid);
    fireEvent.mouseLeave(grid);
    fireEvent.wheel(grid, { deltaY: -100 });

    expect(handlers.onMouseDown).toHaveBeenCalledTimes(1);
    expect(handlers.onMouseMove).toHaveBeenCalledTimes(1);
    expect(handlers.onMouseUp).toHaveBeenCalledTimes(2);
    expect(handlers.onWheel).toHaveBeenCalledTimes(1);
  });

  it('clears the card selection on a background click', () => {
    const { container } = render(<BoardCanvas />);
    const { grid } = getCanvasParts(container);

    fireEvent.click(grid);

    expect(useCardStore.getState().selectedCardId).toBeNull();
  });
});
