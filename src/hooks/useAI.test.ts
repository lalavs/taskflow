import { act, renderHook } from '@testing-library/react';

import { runAI } from '@/entities/ai/api/ai.api';
import { useAI } from '@/hooks/useAI';

jest.mock('@/entities/ai/api/ai.api', () => ({ runAI: jest.fn() }));

const mockedRunAI = jest.mocked(runAI);

describe('useAI', () => {
  it('runs the action and returns the model response', async () => {
    mockedRunAI.mockResolvedValue('Improved text');

    const { result } = renderHook(() => useAI());

    let promise: Promise<string | undefined> | undefined;
    await act(async () => {
      promise = result.current.runAI('draft', 'improve');
    });

    await expect(promise).resolves.toBe('Improved text');
    expect(mockedRunAI).toHaveBeenCalledWith('draft', 'improve');
    expect(result.current.isAIResponseLoading).toBe(false);
  });

  it('flags the request as loading while it is in flight', async () => {
    let resolveRequest: (value: string) => void = () => {};
    mockedRunAI.mockReturnValue(
      new Promise<string>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { result } = renderHook(() => useAI());

    let promise: Promise<string | undefined> | undefined;
    act(() => {
      promise = result.current.runAI('draft', 'summarize');
    });

    expect(result.current.isAIResponseLoading).toBe(true);

    await act(async () => {
      resolveRequest('Summary');
      await promise;
    });

    expect(result.current.isAIResponseLoading).toBe(false);
  });

  it('stops loading and rethrows when the request fails', async () => {
    mockedRunAI.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useAI());

    await expect(
      act(async () => {
        await result.current.runAI('draft', 'improve');
      }),
    ).rejects.toThrow('network down');

    expect(result.current.isAIResponseLoading).toBe(false);
  });
});
