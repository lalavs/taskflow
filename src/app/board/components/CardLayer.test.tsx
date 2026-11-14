import { render, screen } from '@testing-library/react';

import { CardLayer } from '@/app/board/components/CardLayer';
import { useBoardStore } from '@/store/boardStore';
import { useCardStore } from '@/store/cardStore';
import { Note } from '@/types/notes';

jest.mock('./NoteCard', () => ({
  NoteCard: ({ id, zoom, isSelected }: { id: string; zoom: number; isSelected: boolean }) => (
    <div data-testid={`card-${id}`} data-zoom={zoom} data-selected={String(isSelected)} />
  ),
}));

const createNote = (id: string): Note => ({ id, x: 0, y: 0, content: '', height: 96 });

describe('CardLayer', () => {
  it('renders every card with the board zoom and selection state', () => {
    useBoardStore.setState({ x: 0, y: 0, zoom: 1.5 });
    useCardStore.setState({ cards: [createNote('first'), createNote('second')], selectedCardId: 'second' });

    render(<CardLayer />);

    expect(screen.getByTestId('card-first')).toHaveAttribute('data-zoom', '1.5');
    expect(screen.getByTestId('card-first')).toHaveAttribute('data-selected', 'false');
    expect(screen.getByTestId('card-second')).toHaveAttribute('data-selected', 'true');
  });
});
