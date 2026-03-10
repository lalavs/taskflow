'use client';

import { useBoardStore } from '@/store/boardStore';

import { useBoardPanZoom } from '../hooks/useBoardPanZoom';

interface IBoardCanvasProps {
  children?: React.ReactNode;
}

export const BoardCanvas = ({ children }: IBoardCanvasProps) => {
  const { x, y, zoom } = useBoardStore();

  const { onMouseDown, onMouseMove, onMouseUp, onWheel } = useBoardPanZoom();

  return (
    <div
      className="relative h-full w-full bg-gray-100 cursor-grab active:cursor-grabbing overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(#e5e5e5 1px, transparent 1px),
          linear-gradient(90deg, #e5e5e5 1px, transparent 1px)
        `,
        backgroundPosition: `${-x}px ${-y}px`,
        backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <div className="pointer-events-auto">{children}</div>
      </div>
    </div>
  );
};
