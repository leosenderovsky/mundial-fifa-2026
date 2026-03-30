import { cn } from "../../lib/utils";

interface SkeletonProps {
  variant: "card" | "table" | "match" | "player";
  className?: string;
}

export const SkeletonLoader = ({ variant, className }: SkeletonProps) => {
  const baseClass = "bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg";

  const variants = {
    card: (
      <div className={cn("w-full space-y-4", className)}>
        <div className={cn("h-48 w-full", baseClass)} />
        <div className="space-y-2">
          <div className={cn("h-4 w-3/4", baseClass)} />
          <div className={cn("h-4 w-1/2", baseClass)} />
        </div>
      </div>
    ),
    table: (
      <div className={cn("w-full space-y-3", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={cn("h-12 w-full", baseClass)} />
        ))}
      </div>
    ),
    match: (
      <div className={cn("flex items-center justify-between p-6", baseClass, className)}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="w-20 h-4 bg-slate-300 dark:bg-slate-600" />
        </div>
        <div className="w-16 h-10 bg-slate-300 dark:bg-slate-600 rounded" />
        <div className="flex items-center gap-4">
          <div className="w-20 h-4 bg-slate-300 dark:bg-slate-600" />
          <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
      </div>
    ),
    player: (
      <div className={cn("flex flex-col items-center space-y-3", className)}>
        <div className="w-24 h-24 rounded-full bg-slate-300 dark:bg-slate-600" />
        <div className={cn("h-4 w-24", baseClass)} />
      </div>
    ),
  };

  return variants[variant];
};