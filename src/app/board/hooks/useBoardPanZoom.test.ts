import { act, renderHook } from '@testing-library/react';

import { useBoardPanZoom } from '@/app/board/hooks/useBoardPanZoom';
import { updateBoardView } from '@/entities/board/api/board.api';
import { useBoardStore } from '@/store/boardStore';

jest.mock('@/entities/board/api/board.api', () => ({ updateBoardView: jest.fn() }));

const mockedUpdateBoardView = jest.mocked(updateBoardView);

const mouseEvent = (clientX: number, clientY: number) => ({ clientX, clientY }) as unknown as React.MouseEvent;
const wheelEvent = (deltaY: number) => ({ deltaY }) as unknown as React.WheelEvent;

describe('useBoardPanZoom', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useBoardStore.setState({ x: 10, y: 20, zoom: 1 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ignores pointer moves before dragging starts', () => {
    const { result } = renderHook(() => useBoardPanZoom());

    act(() => {
      result.current.onMouseMove(mouseEvent(500, 500));
    });

    expect(useBoardStore.getState()).toMatchObject({ x: 10, y: 20, zoom: 1 });
  });

  it('pans the board by the pointer delta and persists the view on release', () => {
    const { result } = renderHook(() => useBoardPanZoom());

    act(() => {
      result.current.onMouseDown(mouseEvent(100, 100));
    });
    act(() => {
      result.current.onMouseMove(mouseEvent(140, 70));
    });

    expect(useBoardStore.getState()).toMatchObject({ x: 50, y: -10, zoom: 1 });

    act(() => {
      result.current.onMouseUp();
    });

    expect(mockedUpdateBoardView).toHaveBeenCalledWith({ x: 50, y: -10, zoom: 1 });
  });

  it('does not persist the view when the pointer never dragged', () => {
    const { result } = renderHook(() => useBoardPanZoom());

    act(() => {
      result.current.onMouseUp();
    });

    expect(mockedUpdateBoardView).not.toHaveBeenCalled();
  });

  it('zooms within the allowed range and saves the latest state after debounce', () => {
    const { result } = renderHook(() => useBoardPanZoom());

    act(() => {
      result.current.onWheel(wheelEvent(-100));
    });

    expect(useBoardStore.getState().zoom).toBeCloseTo(1.1);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockedUpdateBoardView).toHaveBeenLastCalledWith(expect.objectContaining({ x: 10, y: 20, zoom: 1.1 }));

    act(() => {
      result.current.onWheel(wheelEvent(10000));
    });
    expect(useBoardStore.getState().zoom).toBe(0.1);

    act(() => {
      result.current.onWheel(wheelEvent(-10000));
    });
    expect(useBoardStore.getState().zoom).toBe(5);
  });
});
