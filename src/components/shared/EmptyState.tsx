import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export const EmptyState = ({ icon: Icon, title, subtitle }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
      <Icon className="text-slate-400" size={40} />
    </div>
    <h3 className="headline-md mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-xs">{subtitle}</p>
  </div>
);