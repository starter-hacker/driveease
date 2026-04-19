// FILE: frontend/src/pages/customer/MyBookingsPage.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import { NavBar } from '@/components/shared/NavBar';
import { BookingCard } from '@/components/shared/BookingCard';
import { SlideOver } from '@/components/ui/SlideOver';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { useBookings, useCancelBooking } from '@/hooks/useBookings';
import { formatCurrency, formatDate, generateBookingRef } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';
import { cn } from '@/lib/utils';

const tabs: { label: string; value: BookingStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Upcoming', value: 'CONFIRMED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const cancelBooking = useCancelBooking();

  const { data, isLoading } = useBookings({
    status: activeTab === 'ALL' ? undefined : activeTab,
    page,
    limit: 8,
  });

  const bookings = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-navy-900">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-1">My Bookings</h1>
          <p className="text-white/50 mb-6">
            Track and manage all your rentals
          </p>

          {/* Tabs */}
          <div className="flex gap-1 flex-wrap mb-6 glass-card rounded-xl p-1 border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                }}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0',
                  activeTab === tab.value
                    ? 'bg-brand-blue text-white shadow-blue-glow'
                    : 'text-white/50 hover:text-white hover:bg-white/5',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No bookings found"
              description="You haven't made any bookings yet. Browse our fleet to get started."
            />
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, i) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  delay={i * 0.06}
                  onViewDetails={setSelectedBooking}
                  onCancel={(id) => setCancelId(id)}
                />
              ))}
            </div>
          )}

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                page={page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking detail slide-over */}
      <SlideOver
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40 font-mono">
                {generateBookingRef(selectedBooking.id)}
              </p>
              <Badge variant="booking" status={selectedBooking.status}>
                {selectedBooking.status}
              </Badge>
            </div>

            {selectedBooking.car && (
              <div className="flex gap-3 glass-card rounded-xl p-3">
                {selectedBooking.car.images?.[0] && (
                  <img
                    src={selectedBooking.car.images[0]}
                    alt=""
                    className="w-20 h-14 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-white">
                    {selectedBooking.car.make} {selectedBooking.car.model}
                  </p>
                  <p className="text-xs text-white/40">
                    {selectedBooking.car.year} · {selectedBooking.car.category}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm">
              {[
                {
                  label: 'Pick-up Date',
                  value: formatDate(selectedBooking.pickupDate),
                },
                {
                  label: 'Return Date',
                  value: formatDate(selectedBooking.returnDate),
                },
                {
                  label: 'Duration',
                  value: `${selectedBooking.totalDays} day(s)`,
                },
                {
                  label: 'Pick-up Location',
                  value: selectedBooking.pickupLocation,
                },
                {
                  label: 'Return Location',
                  value: selectedBooking.returnLocation,
                },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-white/40">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Daily Rate</span>
                <span className="text-white">
                  {formatCurrency(selectedBooking.dailyRate)}
                </span>
              </div>
              {selectedBooking.insuranceCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/40">Insurance</span>
                  <span className="text-white">
                    +{formatCurrency(selectedBooking.insuranceCost)}
                  </span>
                </div>
              )}
              {selectedBooking.gpsCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/40">GPS</span>
                  <span className="text-white">
                    +{formatCurrency(selectedBooking.gpsCost)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1 border-t border-white/5">
                <span className="text-white">Total</span>
                <span className="text-white">
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>
            </div>

            {['PENDING', 'CONFIRMED'].includes(selectedBooking.status) && (
              <button
                onClick={() => {
                  setCancelId(selectedBooking.id);
                  setSelectedBooking(null);
                }}
                className="w-full py-3 rounded-xl text-brand-rose border border-brand-rose/30 hover:bg-brand-rose/10 transition-colors text-sm font-medium"
              >
                Cancel This Booking
              </button>
            )}
          </div>
        )}
      </SlideOver>

      {/* Cancel confirm dialog */}
      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={() => {
          if (cancelId) {
            cancelBooking.mutate({
              id: cancelId,
              reason: 'Cancelled by customer',
            });
            setCancelId(null);
          }
        }}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        loading={cancelBooking.isPending}
      />
    </div>
  );
};

export default MyBookingsPage;
