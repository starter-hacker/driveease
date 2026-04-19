// FILE: frontend/src/components/ui/EmptyState.tsx

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      'flex flex-col items-center justify-center py-20 px-4 text-center',
      className,
    )}
  >
    <div className="w-12 h-12 border border-hairline flex items-center justify-center mb-5">
      <Icon className="w-5 h-5 text-stone-5" />
    </div>
    <p className="text-sm font-light text-stone/60 mb-2 tracking-wide">
      {title}
    </p>
    <p className="text-xs text-faint max-w-xs leading-relaxed mb-6">
      {description}
    </p>
    {action}
  </motion.div>
);
