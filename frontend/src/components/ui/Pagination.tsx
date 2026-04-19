// FILE: frontend/src/components/ui/Pagination.tsx

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1),
  );

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center border border-hairline text-stone-5 hover:text-stone hover:border-subtle disabled:opacity-20 transition-all"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      {visible.map((p, i) => {
        const prev = visible[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <div key={p} className="flex items-center gap-1">
            {gap && <span className="text-faint text-xs px-1">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={cn(
                'w-8 h-8 flex items-center justify-center text-xs font-medium transition-all',
                p === page
                  ? 'bg-gold text-ink border border-gold'
                  : 'border border-hairline text-stone-5 hover:text-stone hover:border-subtle',
              )}
            >
              {p}
            </button>
          </div>
        );
      })}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center border border-hairline text-stone-5 hover:text-stone hover:border-subtle disabled:opacity-20 transition-all"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
