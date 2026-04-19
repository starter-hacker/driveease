// FILE: frontend/src/components/shared/BookingCard.tsx

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, generateBookingRef } from '@/lib/utils';
import type { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onViewDetails?: (booking: Booking) => void;
  delay?: number;
}

export const BookingCard = ({
  booking,
  onCancel,
  onViewDetails,
  delay = 0,
}: BookingCardProps) => {
  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass-card rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {booking.car?.images?.[0] && (
            <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-navy-800">
              <img
                src={booking.car.images[0]}
                alt="car"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-semibold text-white text-sm">
              {booking.car
                ? `${booking.car.make} ${booking.car.model} ${booking.car.year}`
                : 'Car details unavailable'}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              {generateBookingRef(booking.id)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="booking" status={booking.status}>
            {booking.status}
          </Badge>
          <Badge
            className={
              booking.paymentStatus === 'PAID'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }
          >
            {booking.paymentStatus}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Calendar className="w-3.5 h-3.5 text-brand-blue shrink-0" />
          <span>{formatDate(booking.pickupDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Calendar className="w-3.5 h-3.5 text-brand-rose shrink-0" />
          <span>{formatDate(booking.returnDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <MapPin className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
          <span className="truncate">{booking.pickupLocation}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Clock className="w-3.5 h-3.5 text-brand-amber shrink-0" />
          <span>
            {booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-white/30" />
          <span className="text-base font-bold text-white">
            {formatCurrency(booking.totalAmount)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(booking)}
            >
              Details
            </Button>
          )}
          {canCancel && onCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel(booking.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
