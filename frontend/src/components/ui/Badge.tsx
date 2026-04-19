// FILE: frontend/src/components/ui/Badge.tsx

import { cn } from '@/lib/utils';
import {
  getBookingStatusPill,
  getCarStatusPill,
  getPaymentStatusPill,
  getLoyaltyPill,
} from '@/lib/utils';
import type { BookingStatus, CarStatus, LoyaltyTier } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'booking' | 'car' | 'loyalty' | 'payment';
  status?: string;
}

export const Badge = ({
  children,
  className,
  variant = 'default',
  status,
}: BadgeProps) => {
  let cls = 'pill';
  if (variant === 'booking' && status)
    cls = getBookingStatusPill(status as BookingStatus);
  else if (variant === 'car' && status)
    cls = getCarStatusPill(status as CarStatus);
  else if (variant === 'loyalty' && status)
    cls = getLoyaltyPill(status as LoyaltyTier);
  else if (variant === 'payment' && status) cls = getPaymentStatusPill(status);
  else cls = cn('pill', 'text-stone-5 bg-white/5');

  return <span className={cn(cls, className)}>{children}</span>;
};
