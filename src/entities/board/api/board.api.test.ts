import axios from 'axios';

import { updateBoardView } from '@/entities/board/api/board.api';
import { Board } from '@/types/board';

jest.mock('axios', () => ({ __esModule: true, default: { patch: jest.fn() } }));

const mockedAxios = jest.mocked(axios);

describe('board.api', () => {
  it('patches the whole board view and returns the stored value', async () => {
    const view: Board = { x: 10, y: 20, zoom: 1.5 };
    mockedAxios.patch.mockResolvedValue({ data: view });

    await expect(updateBoardView(view)).resolves.toEqual(view);
    expect(mockedAxios.patch).toHaveBeenCalledWith('/api/board/view', view);
  });
});
