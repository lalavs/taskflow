import { ImageResponse } from 'next/og';
import { KanbanIcon } from '@/components/ui/KanbanIcon';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

const iconContainerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const Icon = () => {
  return new ImageResponse(
    <div style={iconContainerStyle}>
      <KanbanIcon />
    </div>,
    {
      ...size,
    },
  );
};

export default Icon;
