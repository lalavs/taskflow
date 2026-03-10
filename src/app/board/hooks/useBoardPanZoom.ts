import { useRef } from 'react';

import { useBoardStore } from '@/store/boardStore';

export const useBoardPanZoom = () => {
  const { x, y, setPosition, zoom, setZoom } = useBoardStore();

  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    setPosition(x + dx, y + dy);

    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(zoom + delta, 0.1), 5);
    setZoom(newZoom);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel
  };
};
