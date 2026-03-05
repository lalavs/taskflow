import { KanbanIcon } from '@/components/ui/KanbanIcon';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <KanbanIcon className="shrink-0" />

      <span className="text-lg font-bold text-blue-600 sm:text-xl">TaskFlow</span>
    </div>
  );
};
