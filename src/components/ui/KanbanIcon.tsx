export const KanbanIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#2563eb" />
      <rect x="6" y="8" width="6" height="16" rx="1" fill="white" />
      <rect x="13" y="8" width="6" height="16" rx="1" fill="white" fillOpacity="0.7" />
      <rect x="20" y="8" width="6" height="16" rx="1" fill="white" fillOpacity="0.4" />
    </svg>
  );
};
