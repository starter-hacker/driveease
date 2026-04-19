// FILE: frontend/src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistance, isValid } from 'date-fns';
import type {
  BookingStatus,
  CarStatus,
  LoyaltyTier,
  NotificationType,
} from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, fmt = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return 'Invalid date';
  return format(d, fmt);
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return 'Unknown';
  return formatDistance(d, new Date(), { addSuffix: true });
}

export function calculateBookingTotal(params: {
  pricePerDay: number;
  pricePerWeek: number;
  totalDays: number;
  insuranceIncluded: boolean;
  gpsIncluded: boolean;
  childSeatIncluded: boolean;
}) {
  const {
    pricePerDay,
    pricePerWeek,
    totalDays,
    insuranceIncluded,
    gpsIncluded,
    childSeatIncluded,
  } = params;
  const fullWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;
  const baseAmount = fullWeeks * pricePerWeek + remainingDays * pricePerDay;
  const insuranceCost = insuranceIncluded ? 3000 * totalDays : 0;
  const gpsCost = gpsIncluded ? 1500 * totalDays : 0;
  const childSeatCost = childSeatIncluded ? 1000 * totalDays : 0;
  const subtotal = baseAmount + insuranceCost + gpsCost + childSeatCost;
  return {
    baseAmount,
    insuranceCost,
    gpsCost,
    childSeatCost,
    subtotal,
    totalAmount: subtotal,
  };
}

export function getBookingStatusPill(status: BookingStatus): string {
  const map: Record<BookingStatus, string> = {
    PENDING: 'pill pill-pending',
    CONFIRMED: 'pill pill-confirmed',
    ACTIVE: 'pill pill-active',
    COMPLETED: 'pill pill-completed',
    CANCELLED: 'pill pill-cancelled',
  };
  return map[status] ?? 'pill';
}

export function getCarStatusPill(status: CarStatus): string {
  const map: Record<CarStatus, string> = {
    AVAILABLE: 'pill pill-available',
    RENTED: 'pill pill-rented',
    MAINTENANCE: 'pill pill-maintenance',
    RETIRED: 'pill pill-retired',
  };
  return map[status] ?? 'pill';
}

export function getPaymentStatusPill(status: string): string {
  const map: Record<string, string> = {
    UNPAID: 'pill pill-unpaid',
    PAID: 'pill pill-paid',
    REFUNDED: 'pill pill-refunded',
  };
  return map[status] ?? 'pill';
}

export function getLoyaltyPill(tier: LoyaltyTier): string {
  const map: Record<LoyaltyTier, string> = {
    BRONZE: 'pill pill-bronze',
    SILVER: 'pill pill-silver',
    GOLD: 'pill pill-gold',
    PLATINUM: 'pill pill-platinum',
  };
  return map[tier] ?? 'pill';
}

export function getNotificationColor(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    INFO: 'text-status-blue',
    SUCCESS: 'text-status-green',
    WARNING: 'text-status-amber',
    ERROR: 'text-[#EB5757]',
  };
  return map[type] ?? 'text-muted';
}

export function truncateText(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max) + '…';
}

export function generateBookingRef(id: string): string {
  return `DE-${id.slice(-8).toUpperCase()}`;
}

export function getFullName(user: {
  firstName: string;
  lastName: string;
}): string {
  return `${user.firstName} ${user.lastName}`;
}

export function getInitials(user: {
  firstName: string;
  lastName: string;
}): string {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
}

export function daysBetween(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
