import axios from 'axios';

import { runAI } from '@/entities/ai/api/ai.api';

jest.mock('axios', () => ({ __esModule: true, default: { post: jest.fn() } }));

const mockedAxios = jest.mocked(axios);

describe('ai.api', () => {
  it('posts the text and action and unwraps the result', async () => {
    mockedAxios.post.mockResolvedValue({ data: { result: 'Improved text' } });

    await expect(runAI('draft', 'improve')).resolves.toBe('Improved text');
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/ai', { text: 'draft', action: 'improve' });
  });
});
