'use client';

import { useBoardStore } from '@/store/boardStore';
import { useCardStore } from '@/store/cardStore';
import { useBoardPanZoom } from '../hooks/useBoardPanZoom';
import { useRef } from 'react';

interface IBoardCanvasProps {
  children?: React.ReactNode;
}

// export const BoardCanvas = ({ children }: IBoardCanvasProps) => {
//   const x = useBoardStore((state) => state.x);
//   const y = useBoardStore((state) => state.y);
//   const zoom = useBoardStore((state) => state.zoom);

//   const setSelectedCardId = useCardStore((state) => state.setSelectedCardId);

//   const { onMouseDown, onMouseMove, onMouseUp, onWheel } = useBoardPanZoom();

//   return (
//     <div className="relative h-full w-full bg-gray-100 overflow-hidden">
//       <div
//         className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
//         style={{
//           backgroundImage: `
//           linear-gradient(#e5e5e5 1px, transparent 1px),
//           linear-gradient(90deg, #e5e5e5 1px, transparent 1px)
//         `,
//           backgroundPosition: `${-x}px ${-y}px`,
//           backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
//         }}
//         onMouseDown={onMouseDown}
//         onMouseMove={onMouseMove}
//         onMouseUp={onMouseUp}
//         onMouseLeave={onMouseUp}
//         onWheel={onWheel}
//         onClick={() => setSelectedCardId(null)}
//       />
//       <div
//         className="absolute inset-0 w-full h-full pointer-events-none cursor-grab active:cursor-grabbing"
//         style={{
//           transform: `translate(${x}px, ${y}px) scale(${zoom})`,
//           transformOrigin: '0 0',
//         }}
//       >
//         <div className="pointer-events-auto">{children}</div>
//       </div>
//     </div>
//   );
// };

export const BoardCanvas = ({ children }: IBoardCanvasProps) => {
  const x = useBoardStore((state) => state.x);
  const y = useBoardStore((state) => state.y);
  const zoom = useBoardStore((state) => state.zoom);
  const setSelectedCardId = useCardStore((state) => state.setSelectedCardId);

  const { onMouseDown, onMouseMove, onMouseUp, onWheel } = useBoardPanZoom();

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative h-full w-full bg-gray-100 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
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
        onClick={() => setSelectedCardId(null)}
      />
      {/* Layer for cards */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none cursor-grab active:cursor-grabbing"
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
