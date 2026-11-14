import { useCardStore } from '@/store/cardStore';
import { Note } from '@/types/notes';

const createNote = (id: string, overrides: Partial<Note> = {}): Note => ({
  id,
  x: 0,
  y: 0,
  content: '',
  height: 96,
  ...overrides,
});

describe('cardStore', () => {
  beforeEach(() => {
    useCardStore.setState({ cards: [], selectedCardId: null });
  });

  it('appends a new card without dropping existing ones', () => {
    const first = createNote('first');
    const second = createNote('second');

    useCardStore.getState().addCard(first);
    useCardStore.getState().addCard(second);

    expect(useCardStore.getState().cards).toEqual([first, second]);
  });

  it('replaces the whole card list', () => {
    const cards = [createNote('a'), createNote('b')];

    useCardStore.getState().setCards(cards);

    expect(useCardStore.getState().cards).toEqual(cards);
  });

  it('moves only the requested card', () => {
    const moving = createNote('moving');
    const untouched = createNote('untouched', { x: 5, y: 5 });

    useCardStore.setState({ cards: [moving, untouched] });
    useCardStore.getState().moveCard('moving', 120, -30);

    expect(useCardStore.getState().cards).toEqual([{ ...moving, x: 120, y: -30 }, untouched]);
  });

  it('merges partial updates into the requested card', () => {
    const note = createNote('note', { content: 'old', height: 96 });

    useCardStore.setState({ cards: [note] });
    useCardStore.getState().updateCard('note', { content: 'new' });

    expect(useCardStore.getState().cards[0]).toEqual({ ...note, content: 'new' });
  });

  it('leaves other cards untouched when updating one', () => {
    const changing = createNote('changing');
    const untouched = createNote('untouched', { content: 'keep me' });

    useCardStore.setState({ cards: [changing, untouched] });
    useCardStore.getState().updateCard('changing', { content: 'changed' });

    expect(useCardStore.getState().cards[1]).toEqual(untouched);
  });

  it('selects and clears the selected card', () => {
    useCardStore.getState().setSelectedCardId('note-1');
    expect(useCardStore.getState().selectedCardId).toBe('note-1');

    useCardStore.getState().setSelectedCardId(null);
    expect(useCardStore.getState().selectedCardId).toBeNull();
  });

  it('drops the selection when the selected card is deleted', () => {
    useCardStore.setState({ cards: [createNote('selected')], selectedCardId: 'selected' });

    useCardStore.getState().deleteCard('selected');

    expect(useCardStore.getState().cards).toEqual([]);
    expect(useCardStore.getState().selectedCardId).toBeNull();
  });

  it('keeps the selection when another card is deleted', () => {
    useCardStore.setState({ cards: [createNote('keep'), createNote('remove')], selectedCardId: 'keep' });

    useCardStore.getState().deleteCard('remove');

    expect(useCardStore.getState().cards.map((card) => card.id)).toEqual(['keep']);
    expect(useCardStore.getState().selectedCardId).toBe('keep');
  });
});
