import { useCallback, useRef } from 'react';

import { useBoardStore } from '@/store/boardStore';

import { updateBoardView } from '@/entities/board/api/board.api';

import { useDebounce } from '@/hooks/useDebounce';

export const useBoardPanZoom = () => {
  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const x = useBoardStore((state) => state.x);
  const y = useBoardStore((state) => state.y);
  const zoom = useBoardStore((state) => state.zoom);
  const setPosition = useBoardStore((state) => state.setPosition);

  const debounce = useDebounce(500);

  const saveView = useCallback(() => {
    updateBoardView({ x, y, zoom });
  }, [x, y, zoom]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;

      setPosition(x + dx, y + dy);

      last.current = { x: e.clientX, y: e.clientY };
    },
    [x, y, setPosition],
  );

  const onMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;

      saveView();
    }
  }, [saveView]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const state = useBoardStore.getState();

    const delta = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(state.zoom + delta, 0.1), 5);

    state.setZoom(newZoom);

    debounce(() => {
      const latest = useBoardStore.getState();

      updateBoardView(latest);
    });
  }, []);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  };
};
