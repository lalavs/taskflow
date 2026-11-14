import { runAI } from '@/lib/ai/ai.service';

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    chat: {
      completions: {
        create: (...args: unknown[]) => mockCreateCompletion(...args),
      },
    },
  })),
}));

const mockCreateCompletion = jest.fn();

interface CompletionRequest {
  model: string;
  messages: { role: string; content: string }[];
}

const lastRequest = () => mockCreateCompletion.mock.calls[0]?.[0] as CompletionRequest | undefined;

describe('ai.service', () => {
  it('rewrites the text with the improve prompt', async () => {
    mockCreateCompletion.mockResolvedValue({ choices: [{ message: { content: 'Better text' } }] });

    await expect(runAI('draft text', 'improve')).resolves.toBe('Better text');

    const request = lastRequest();

    expect(request?.model).toBe('deepseek/deepseek-chat');
    expect(request?.messages[0]).toEqual({ role: 'system', content: expect.stringContaining('You are a direct text processor') });
    expect(request?.messages[1]?.content).toContain('Rewrite');
    expect(request?.messages[1]?.content).toContain('draft text');
  });

  it('summarizes the text with the summarize prompt', async () => {
    mockCreateCompletion.mockResolvedValue({ choices: [{ message: { content: 'Short summary' } }] });

    await expect(runAI('long text', 'summarize')).resolves.toBe('Short summary');

    const request = lastRequest();

    expect(request?.messages[1]?.content).toContain('Summarize');
    expect(request?.messages[1]?.content).toContain('long text');
  });

  it('returns undefined when the model answers without choices', async () => {
    mockCreateCompletion.mockResolvedValue({ choices: [] });

    await expect(runAI('draft', 'improve')).resolves.toBeUndefined();
  });

  it('swallows model failures after logging them', async () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockCreateCompletion.mockRejectedValue(new Error('openrouter down'));

    await expect(runAI('draft', 'improve')).resolves.toBeUndefined();
    expect(consoleWarn).toHaveBeenCalled();

    consoleWarn.mockRestore();
  });
});
