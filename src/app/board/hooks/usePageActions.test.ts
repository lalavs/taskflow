import { act, renderHook } from '@testing-library/react';
import { DragEndEvent } from '@dnd-kit/core';

import { usePageActions } from '@/app/board/hooks/usePageActions';
import { deleteNote, updateNote } from '@/entities/note/api/note.api';
import { useBoardStore } from '@/store/boardStore';
import { useCardStore } from '@/store/cardStore';
import { Note } from '@/types/notes';

jest.mock('@/entities/note/api/note.api', () => ({ updateNote: jest.fn(), deleteNote: jest.fn() }));
jest.mock('uuid', () => ({ v4: () => 'generated-id' }));

const mockedUpdateNote = jest.mocked(updateNote);
const mockedDeleteNote = jest.mocked(deleteNote);

const createNote = (id: string, overrides: Partial<Note> = {}): Note => ({
  id,
  x: 0,
  y: 0,
  content: '',
  height: 96,
  ...overrides,
});

const dragEndEvent = (id: string, deltaX: number, deltaY: number) => ({ active: { id }, delta: { x: deltaX, y: deltaY } }) as unknown as DragEndEvent;

describe('usePageActions', () => {
  beforeEach(() => {
    useBoardStore.setState({ x: 100, y: 50, zoom: 2 });
    useCardStore.setState({ cards: [], selectedCardId: null });
  });

  it('moves a dragged card in board coordinates and persists it', () => {
    useCardStore.setState({ cards: [createNote('card')] });

    const { result } = renderHook(() => usePageActions());

    act(() => {
      result.current.handleDragEnd(dragEndEvent('card', 40, 20));
    });

    expect(useCardStore.getState().cards[0]).toMatchObject({ x: 20, y: 10 });
    expect(mockedUpdateNote).toHaveBeenCalledWith('card', { x: 20, y: 10, content: '', height: 96 });
  });

  it('ignores drags of cards that are not on the board', () => {
    const { result } = renderHook(() => usePageActions());

    act(() => {
      result.current.handleDragEnd(dragEndEvent('missing', 40, 20));
    });

    expect(mockedUpdateNote).not.toHaveBeenCalled();
  });

  it('adds a new card at the viewport center', () => {
    const { result } = renderHook(() => usePageActions());

    act(() => {
      result.current.handleAddCard();
    });

    const [card] = useCardStore.getState().cards;

    expect(card).toEqual({ id: 'generated-id', x: 110, y: 71, content: '', height: 96 });
    expect(mockedUpdateNote).toHaveBeenCalledWith('generated-id', card);
  });

  it('deletes the selected card with the Delete key', () => {
    useCardStore.setState({ cards: [createNote('card')], selectedCardId: 'card' });

    renderHook(() => usePageActions());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
    });

    expect(mockedDeleteNote).toHaveBeenCalledWith('card');
    expect(useCardStore.getState().cards).toEqual([]);
    expect(useCardStore.getState().selectedCardId).toBeNull();
  });

  it('deletes the selected card with Backspace', () => {
    useCardStore.setState({ cards: [createNote('card')], selectedCardId: 'card' });

    renderHook(() => usePageActions());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    });

    expect(mockedDeleteNote).toHaveBeenCalledWith('card');
  });

  it('ignores deletion keys while the textarea is focused', () => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    useCardStore.setState({ cards: [createNote('card')], selectedCardId: 'card' });

    renderHook(() => usePageActions());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    });

    expect(mockedDeleteNote).not.toHaveBeenCalled();
    expect(useCardStore.getState().cards).toHaveLength(1);

    textarea.remove();
  });

  it('does nothing when no card is selected', () => {
    renderHook(() => usePageActions());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
    });

    expect(mockedDeleteNote).not.toHaveBeenCalled();
  });

  it('ignores unrelated keys', () => {
    useCardStore.setState({ cards: [createNote('card')], selectedCardId: 'card' });

    renderHook(() => usePageActions());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    expect(mockedDeleteNote).not.toHaveBeenCalled();
  });

  it('stops listening for keys after unmount', () => {
    useCardStore.setState({ cards: [createNote('card')], selectedCardId: 'card' });

    const { unmount } = renderHook(() => usePageActions());
    unmount();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
    });

    expect(mockedDeleteNote).not.toHaveBeenCalled();
  });
});
