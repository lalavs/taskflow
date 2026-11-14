/** @jest-environment node */

import { POST } from '@/app/api/ai/route';
import { runAI } from '@/lib/ai/ai.service';
import { AIAction } from '@/types/ai-actions';

jest.mock('@/lib/ai/ai.service', () => ({ runAI: jest.fn() }));

const mockedRunAI = jest.mocked(runAI);

const aiRequest = (body: { text?: string; action?: AIAction }) => ({ json: async () => body }) as unknown as Request;

describe('POST /api/ai', () => {
  it('returns the processed text', async () => {
    mockedRunAI.mockResolvedValue('Improved text');

    const response = await POST(aiRequest({ text: 'draft', action: 'improve' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ result: 'Improved text' });
    expect(mockedRunAI).toHaveBeenCalledWith('draft', 'improve');
  });

  it('rejects an empty request body', async () => {
    const response = await POST(aiRequest({ text: '', action: 'improve' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'No text' });
    expect(mockedRunAI).not.toHaveBeenCalled();
  });
});
