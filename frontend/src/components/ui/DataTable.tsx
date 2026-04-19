// FILE: frontend/src/components/ui/DataTable.tsx

import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { Search } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor: (row: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  onRowClick,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records to display.',
  keyExtractor,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as Record<string, unknown>)[sortKey];
    const bv = (b as Record<string, unknown>)[sortKey];
    if (av === undefined || bv === undefined) return 0;
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        icon={Search}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider',
                  col.sortable &&
                    'cursor-pointer hover:text-white/70 select-none',
                  col.className,
                )}
                onClick={
                  col.sortable ? () => handleSort(String(col.key)) : undefined
                }
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="text-white/20">
                      {sortKey === String(col.key) ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sortedData.map((row) => (
            <tr
              key={keyExtractor(row)}
              className={cn(
                'transition-colors duration-150',
                onRowClick && 'cursor-pointer hover:bg-white/3',
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-sm text-white/80',
                    col.className,
                  )}
                >
                  {col.cell
                    ? col.cell(row)
                    : String(
                        (row as Record<string, unknown>)[String(col.key)] ?? '',
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
