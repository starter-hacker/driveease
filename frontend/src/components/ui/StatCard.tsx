// FILE: frontend/src/components/ui/StatCard.tsx

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };
  className?: string;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-gold',
  trend,
  className,
  delay = 0,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
    className={cn('stat-card-item', className)}
  >
    <div className="flex items-start justify-between mb-4">
      <p className="stat-label">{title}</p>
      <Icon className={cn('w-4 h-4 opacity-40', iconColor)} />
    </div>
    <p className="stat-value">{value}</p>
    {subtitle && (
      <p className="text-[11px] text-faint tracking-wide mt-1">{subtitle}</p>
    )}
    {trend && (
      <div className={cn('stat-trend mt-3', trend.value < 0 && 'down')}>
        <span>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
        </span>
        <span className="text-faint">{trend.label}</span>
      </div>
    )}
  </motion.div>
);
