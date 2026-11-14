import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BoardClient from '@/app/board/BoardClient';
import { usePageActions } from './hooks/usePageActions';
import { useBoardStore } from '@/store/boardStore';
import { useCardStore } from '@/store/cardStore';
import { Board } from '@/types/board';
import { Note } from '@/types/notes';

jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-context">{children}</div>,
  PointerSensor: jest.fn(),
  useSensor: jest.fn(() => ({})),
  useSensors: jest.fn(() => []),
}));

jest.mock('./components/BoardCanvas', () => ({
  BoardCanvas: ({ children }: { children: React.ReactNode }) => <div data-testid="board-canvas">{children}</div>,
}));

jest.mock('./components/CardLayer', () => ({
  CardLayer: () => <div data-testid="card-layer" />,
}));

jest.mock('./hooks/usePageActions', () => ({ usePageActions: jest.fn() }));

const mockedUsePageActions = jest.mocked(usePageActions);

const note: Note = { id: 'note-1', x: 5, y: 5, content: 'First', height: 96 };
const view: Board = { x: 1, y: 2, zoom: 3 };

describe('BoardClient', () => {
  const handlers = { handleDragEnd: jest.fn(), handleAddCard: jest.fn() };

  beforeEach(() => {
    mockedUsePageActions.mockReturnValue(handlers);
    useBoardStore.setState({ x: 0, y: 0, zoom: 1 });
    useCardStore.setState({ cards: [], selectedCardId: null });
  });

  it('hydrates the stores from the server data', () => {
    render(<BoardClient initialNotes={[note]} initialView={view} />);

    expect(useCardStore.getState().cards).toEqual([note]);
    expect(useBoardStore.getState()).toMatchObject(view);
    expect(screen.getByTestId('board-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('card-layer')).toBeInTheDocument();
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
  });

  it('adds a card through the page actions', async () => {
    const user = userEvent.setup();

    render(<BoardClient initialNotes={[]} initialView={view} />);
    await user.click(screen.getByRole('button', { name: 'Add Card' }));

    expect(handlers.handleAddCard).toHaveBeenCalledTimes(1);
  });

  it('links back to the landing page', () => {
    render(<BoardClient initialNotes={[]} initialView={view} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
