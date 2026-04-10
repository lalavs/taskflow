import { useState } from 'react';

import { runAI } from '@/entities/ai/api/ai.api';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const run = async (text: string, action: string) => {
    setIsLoading(true);

    try {
      const result = await runAI(text, action);

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { runAI: run, isAIResponseLoading: isLoading };
};
