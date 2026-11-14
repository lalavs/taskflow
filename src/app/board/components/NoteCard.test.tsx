import { act, fireEvent, render, screen } from '@testing-library/react';
import { useDraggable } from '@dnd-kit/core';

import { NoteCard } from '@/app/board/components/NoteCard';
import { updateNote } from '@/entities/note/api/note.api';
import { useAI } from '@/hooks/useAI';
import { useCardStore } from '@/store/cardStore';
import { Note } from '@/types/notes';

jest.mock('@dnd-kit/core', () => ({ useDraggable: jest.fn() }));
jest.mock('@/entities/note/api/note.api', () => ({ updateNote: jest.fn() }));
jest.mock('@/hooks/useAI', () => ({ useAI: jest.fn() }));

const mockedUseDraggable = jest.mocked(useDraggable);
const mockedUseAI = jest.mocked(useAI);
const mockedUpdateNote = jest.mocked(updateNote);

const note: Note = { id: 'card-1', x: 30, y: 40, content: 'Hello', height: 96 };
const noteProps = { ...note, zoom: 2, isSelected: false };

type RunAI = ReturnType<typeof useAI>['runAI'];

const dragState = (overrides: Record<string, unknown> = {}) => ({
  attributes: {},
  listeners: {},
  transform: null,
  setNodeRef: jest.fn(),
  ...overrides,
});

const getCard = (container: HTMLElement) => {
  const card = container.firstElementChild;

  if (!(card instanceof HTMLDivElement)) {
    throw new Error('Card is not rendered');
  }

  return card;
};

describe('NoteCard', () => {
  let runAIHandler: jest.MockedFunction<RunAI>;

  beforeEach(() => {
    jest.useFakeTimers();
    runAIHandler = jest.fn();
    mockedUseAI.mockReturnValue({ isAIResponseLoading: false, runAI: runAIHandler });
    mockedUseDraggable.mockReturnValue(dragState() as unknown as ReturnType<typeof useDraggable>);
    useCardStore.setState({ cards: [note], selectedCardId: null });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the note content at its board position', () => {
    const { container } = render(<NoteCard {...noteProps} />);
    const card = getCard(container);

    expect(card.style.left).toBe('30px');
    expect(card.style.top).toBe('40px');
    expect(card.style.transform).toBe('');
    expect(screen.getByPlaceholderText('Add text')).toHaveValue('Hello');
  });

  it('applies the drag transform scaled by the board zoom', () => {
    mockedUseDraggable.mockReturnValue(
      dragState({ transform: { x: 20, y: 10, scaleX: 1, scaleY: 1 } }) as unknown as ReturnType<typeof useDraggable>,
    );

    const { container } = render(<NoteCard {...noteProps} />);

    expect(getCard(container).style.transform).toBe('translate(10px, 5px)');
  });

  it('selects the card on click', () => {
    const { container } = render(<NoteCard {...noteProps} />);

    fireEvent.click(getCard(container));

    expect(useCardStore.getState().selectedCardId).toBe('card-1');
  });

  it('highlights the selected card', () => {
    const { container } = render(<NoteCard {...noteProps} isSelected />);

    expect(getCard(container)).toHaveClass('ring-2', 'ring-blue-400');
  });

  it('switches to editing on double click and back on blur', () => {
    const { container } = render(<NoteCard {...noteProps} />);
    const textarea = screen.getByPlaceholderText('Add text');

    expect(textarea).toHaveClass('pointer-events-none');

    fireEvent.doubleClick(getCard(container));
    expect(textarea).not.toHaveClass('pointer-events-none');

    fireEvent.blur(textarea);
    expect(textarea).toHaveClass('pointer-events-none');
  });

  it('updates the store while typing and saves the note after the debounce', () => {
    const { container } = render(<NoteCard {...noteProps} />);
    const textarea = screen.getByPlaceholderText('Add text');

    fireEvent.doubleClick(getCard(container));
    fireEvent.change(textarea, { target: { value: 'Updated text' } });

    expect(useCardStore.getState().cards[0]?.content).toBe('Updated text');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockedUpdateNote).toHaveBeenCalledWith('card-1', expect.objectContaining({ content: 'Updated text' }));
  });

  it('skips saving when the card has been removed meanwhile', () => {
    const { container } = render(<NoteCard {...noteProps} />);

    fireEvent.doubleClick(getCard(container));
    fireEvent.change(screen.getByPlaceholderText('Add text'), { target: { value: 'Orphan' } });
    useCardStore.setState({ cards: [] });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockedUpdateNote).not.toHaveBeenCalled();
  });

  it('applies the AI result and persists the card', async () => {
    runAIHandler.mockResolvedValue('Improved text');

    const { container } = render(<NoteCard {...noteProps} />);
    fireEvent.doubleClick(getCard(container));

    fireEvent.click(screen.getByRole('button'));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Improve' }));
    });

    expect(runAIHandler).toHaveBeenCalledWith('Hello', 'improve');
    expect(useCardStore.getState().cards[0]?.content).toBe('Improved text');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockedUpdateNote).toHaveBeenCalledWith('card-1', expect.objectContaining({ content: 'Improved text' }));
  });

  it('does not call the model for an empty note', async () => {
    const { container } = render(<NoteCard {...noteProps} content="" />);
    fireEvent.doubleClick(getCard(container));
    fireEvent.click(screen.getByRole('button'));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Improve' }));
    });

    expect(runAIHandler).not.toHaveBeenCalled();
  });

  it('keeps the note untouched when the model returns nothing', async () => {
    runAIHandler.mockResolvedValue(undefined);

    const { container } = render(<NoteCard {...noteProps} />);
    fireEvent.doubleClick(getCard(container));
    fireEvent.click(screen.getByRole('button'));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Improve' }));
    });

    expect(useCardStore.getState().cards[0]?.content).toBe('Hello');
  });

  it('disables the textarea while the model is responding', () => {
    mockedUseAI.mockReturnValue({ isAIResponseLoading: true, runAI: runAIHandler });

    render(<NoteCard {...noteProps} />);

    expect(screen.getByPlaceholderText('Add text')).toBeDisabled();
  });

  it('drops drag listeners while editing', () => {
    const onPointerDown = jest.fn();
    mockedUseDraggable.mockReturnValue(dragState({ listeners: { onPointerDown } }) as unknown as ReturnType<typeof useDraggable>);

    const { container } = render(<NoteCard {...noteProps} />);
    const card = getCard(container);

    fireEvent.pointerDown(card);
    expect(onPointerDown).toHaveBeenCalledTimes(1);

    fireEvent.doubleClick(card);
    fireEvent.pointerDown(card);

    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });
});
