import { useCallback, useRef } from 'react';
import { useBoardStore } from '@/store/boardStore';

export const useBoardPanZoom = () => {
  const x = useBoardStore((state) => state.x);
  const y = useBoardStore((state) => state.y);
  const zoom = useBoardStore((state) => state.zoom);

  const setPosition = useBoardStore((state) => state.setPosition);
  const setZoom = useBoardStore((state) => state.setZoom);

  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

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
    isDragging.current = false;
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(Math.max(zoom + delta, 0.1), 5);

      setZoom(newZoom);
    },
    [zoom, setZoom],
  );

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  };
};
