import { useRef } from 'react';

export const useDebounce = (delay: number = 500) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = (fn: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fn();
    }, delay);
  };

  return debounce;
};
