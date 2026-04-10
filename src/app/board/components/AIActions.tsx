import { useState } from 'react';
import { clsx } from 'clsx';

import { Button } from '@/components/ui/Button';

import { AIAction, AI_ACTIONS } from '@/types/ai-actions';

interface AIActionsProps {
  loading: boolean;
  isVisible: boolean;
  onRun: (action: AIAction) => void;
}

export const AIActions = ({ loading, isVisible, onRun }: AIActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onAIMenuOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action: AIAction) => {
    onRun(action);
    setIsOpen(false);
  };

  const onAIMenuMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-2 right-2 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Button variant="helper" onClick={() => handleActionClick(AI_ACTIONS.IMPROVE)} onMouseDown={(e) => e.preventDefault()}>
            Improve
          </Button>

          <Button variant="helper" onClick={() => handleActionClick(AI_ACTIONS.SUMMARIZE)} onMouseDown={(e) => e.preventDefault()}>
            Summary
          </Button>
        </div>
      )}

      <button
        className={clsx(
          'w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-color duration-200',
          isOpen ? 'bg-blue-500 text-white rotate-90' : 'bg-white text-orange-500 hover:bg-orange-50',
        )}
        onClick={onAIMenuOpen}
        onMouseDown={onAIMenuMouseDown}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-lg select-none">AI</span>
        )}
      </button>
    </div>
  );
};
