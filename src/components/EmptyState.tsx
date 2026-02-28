import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-4" role="status">
      <Icon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-semibold transition-colors min-h-[44px]"
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
