import { render, screen } from '@testing-library/react';

import BoardPage from '@/app/board/page';
import BoardClient from './BoardClient';
import { auth } from '@/lib/auth';
import { getBoardView } from '@/entities/board/model/board.repo';
import { getAllNotes } from '@/entities/note/model/note.repo';
import { redirect } from 'next/navigation';
import { Board } from '@/types/board';

jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('@/lib/auth', () => ({ auth: jest.fn() }));
jest.mock('@/entities/note/model/note.repo', () => ({ getAllNotes: jest.fn() }));
jest.mock('@/entities/board/model/board.repo', () => ({ getBoardView: jest.fn() }));
jest.mock('./BoardClient', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="board-client" />),
}));

const mockedAuth = jest.mocked(auth);
const mockedGetAllNotes = jest.mocked(getAllNotes);
const mockedGetBoardView = jest.mocked(getBoardView);
const mockedRedirect = jest.mocked(redirect);
const mockedBoardClient = jest.mocked(BoardClient);

const note = { id: 'note-1', userId: 'user-1', x: 0, y: 0, content: 'First', height: 96 };
const view: Board = { x: 0, y: 0, zoom: 1 };

describe('BoardPage', () => {
  it('sends guests back to the landing page', async () => {
    mockedAuth.mockResolvedValue(null);
    mockedRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(BoardPage()).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedRedirect).toHaveBeenCalledWith('/');
    expect(mockedGetAllNotes).not.toHaveBeenCalled();
    expect(mockedGetBoardView).not.toHaveBeenCalled();
  });

  it('loads the board data for the signed-in user', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' }, expires: '2099-01-01' });
    mockedGetAllNotes.mockResolvedValue([note]);
    mockedGetBoardView.mockResolvedValue({ ...view, id: 'view-1', userId: 'user-1' });

    const element = await BoardPage();
    render(element);

    expect(mockedGetAllNotes).toHaveBeenCalledWith('user-1');
    expect(mockedGetBoardView).toHaveBeenCalledWith('user-1');
    expect(mockedBoardClient.mock.calls[0]?.[0]).toEqual({
      initialNotes: [note],
      initialView: { ...view, id: 'view-1', userId: 'user-1' },
    });
    expect(screen.getByTestId('board-client')).toBeInTheDocument();
  });
});
