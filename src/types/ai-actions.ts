export const AI_ACTIONS = {
  IMPROVE: 'improve',
  SUMMARIZE: 'summarize',
} as const;

export type AIAction = (typeof AI_ACTIONS)[keyof typeof AI_ACTIONS];
