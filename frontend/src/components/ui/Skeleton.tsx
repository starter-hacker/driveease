// FILE: frontend/src/components/ui/Skeleton.tsx

import { cn } from '@/lib/utils';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton', className)} />
);

export const CarCardSkeleton = () => (
  <div className="bg-ink-3 border border-hairline">
    <Skeleton className="h-48 w-full" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center pt-3 border-t border-hairline">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="stat-card-item space-y-3">
    <Skeleton className="h-3 w-28" />
    <Skeleton className="h-8 w-36" />
    <Skeleton className="h-3 w-20" />
  </div>
);
