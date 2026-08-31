import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-muted/60 dark:bg-muted/40',
        className
      )}
      {...props}
    />
  );
};

export const SkeletonHeader: React.FC = () => (
  <div className="w-full space-y-4 mb-8">
    <Skeleton className="h-6 w-32 rounded-full" />
    <Skeleton className="h-10 w-3/4 max-w-xl rounded-2xl" />
    <Skeleton className="h-5 w-1/2 max-w-lg rounded-xl" />
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="w-full bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-sm">
    <div className="flex items-center justify-between">
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-6 w-2/3 rounded-xl" />
    <Skeleton className="h-4 w-full rounded-lg" />
    <Skeleton className="h-4 w-4/5 rounded-lg" />
  </div>
);

export const SkeletonVisualizer: React.FC = () => (
  <div className="w-full bg-card border border-border/80 rounded-3xl p-6 space-y-6 shadow-sm min-h-[350px] flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-48 rounded-xl" />
      <Skeleton className="h-8 w-24 rounded-full" />
    </div>
    <div className="flex items-end justify-center gap-3 h-48 py-4">
      {[40, 65, 30, 85, 50, 70, 45, 90].map((h, i) => (
        <Skeleton key={i} className="w-8 rounded-t-xl" style={{ height: `${h}%` }} />
      ))}
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-border/50">
      <Skeleton className="h-10 w-32 rounded-xl" />
      <Skeleton className="h-10 w-48 rounded-xl" />
    </div>
  </div>
);
