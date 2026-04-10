import OpenAI from 'openai';

import { AIAction } from '@/types/ai-actions';

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const SYSTEM_INSTRUCTION =
  'You are a direct text processor. ' +
  'Provide ONLY the final result. ' +
  "No introductions (like 'Here is...'), no explanations, no conversational filler.";

const PROMPTS: Record<AIAction, (text: string) => string> = {
  improve: (text) =>
    `Rewrite the following text to make it clearer, more professional, and grammatically correct. ` + `Output ONLY the rewritten text.\n\n${text}`,
  summarize: (text) => `Summarize the following text concisely. ` + `Output ONLY the summary.\n\n${text}`,
};

export const runAI = async (text: string, action: AIAction) => {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    { role: 'user', content: PROMPTS[action](text) },
  ];

  try {
    const res = await openrouter.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      messages,
    });

    return res.choices[0]?.message.content;
  } catch (e) {
    console.warn(e);
  }
};
