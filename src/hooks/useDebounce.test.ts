import { act, renderHook } from '@testing-library/react';

import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls the callback only after the delay has passed', () => {
    const { result } = renderHook(() => useDebounce(300));
    const callback = jest.fn();

    act(() => {
      result.current(callback);
      jest.advanceTimersByTime(299);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('drops the previous call when invoked again within the delay', () => {
    const { result } = renderHook(() => useDebounce(100));
    const first = jest.fn();
    const second = jest.fn();

    act(() => {
      result.current(first);
      jest.advanceTimersByTime(50);
      result.current(second);
      jest.advanceTimersByTime(100);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('falls back to the default delay', () => {
    const { result } = renderHook(() => useDebounce());
    const callback = jest.fn();

    act(() => {
      result.current(callback);
      jest.advanceTimersByTime(499);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
