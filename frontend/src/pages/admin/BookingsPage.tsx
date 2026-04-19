// FILE: frontend/src/pages/admin/BookingsPage.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/ui/DataTable';
import { SlideOver } from '@/components/ui/SlideOver';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency, formatDate, generateBookingRef } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';
import { Search, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusTabs = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
] as const;

const BookingsPage = () => {
  const [activeTab, setActiveTab] =
    useState<(typeof statusTabs)[number]>('ALL');
  const [page, setPage] = useState(1);
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw, 400);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const updateStatus = useUpdateBookingStatus();

  const { data, isLoading } = useBookings({
    status: activeTab === 'ALL' ? undefined : activeTab,
    search,
    page,
    limit: 15,
  });

  const bookings = data?.data || [];
  const meta = data?.meta;

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => setSelectedBooking(null),
      },
    );
  };

  const columns = [
    {
      key: 'id',
      header: 'Booking',
      cell: (b: Booking) => (
        <div>
          <p className="text-sm font-medium text-white font-mono">
            {generateBookingRef(b.id)}
          </p>
          <p className="text-xs text-white/40">{formatDate(b.createdAt)}</p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Customer',
      cell: (b: Booking) => (
        <div>
          <p className="text-sm text-white">
            {b.user ? `${b.user.firstName} ${b.user.lastName}` : '—'}
          </p>
          <p className="text-xs text-white/40">{b.user?.email}</p>
        </div>
      ),
    },
    {
      key: 'car',
      header: 'Car',
      cell: (b: Booking) => (
        <div className="flex items-center gap-2">
          {b.car?.images?.[0] && (
            <img
              src={b.car.images[0]}
              alt=""
              className="w-10 h-7 rounded-lg object-cover"
            />
          )}
          <div>
            <p className="text-sm text-white">
              {b.car ? `${b.car.make} ${b.car.model}` : '—'}
            </p>
            <p className="text-xs text-white/40">{b.car?.year}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'pickupDate',
      header: 'Dates',
      cell: (b: Booking) => (
        <div className="flex items-center gap-1 text-xs text-white/60">
          <Calendar className="w-3 h-3" />
          <span>
            {formatDate(b.pickupDate, 'dd MMM')} →{' '}
            {formatDate(b.returnDate, 'dd MMM yy')}
          </span>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      cell: (b: Booking) => (
        <span className="text-white font-semibold">
          {formatCurrency(b.totalAmount)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (b: Booking) => (
        <div className="flex flex-col gap-1">
          <Badge variant="booking" status={b.status}>
            {b.status}
          </Badge>
          <Badge
            className={
              b.paymentStatus === 'PAID'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]'
            }
          >
            {b.paymentStatus}
          </Badge>
        </div>
      ),
    },
  ];

  const statusActions: Record<
    string,
    {
      label: string;
      status: string;
      variant: 'primary' | 'success' | 'danger';
    }[]
  > = {
    PENDING: [
      { label: 'Confirm', status: 'CONFIRMED', variant: 'primary' },
      { label: 'Cancel', status: 'CANCELLED', variant: 'danger' },
    ],
    CONFIRMED: [
      { label: 'Mark Active', status: 'ACTIVE', variant: 'success' },
      { label: 'Cancel', status: 'CANCELLED', variant: 'danger' },
    ],
    ACTIVE: [{ label: 'Complete', status: 'COMPLETED', variant: 'success' }],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Bookings</h1>
        <p className="page-subheader">
          {meta ? `${meta.total} total bookings` : 'Loading...'}
        </p>
      </div>

      <div className="flex gap-1 flex-wrap glass-card rounded-xl p-1 border border-white/5 w-fit">
        {statusTabs.map((s) => (
          <button
            key={s}
            onClick={() => {
              setActiveTab(s);
              setPage(1);
            }}
            className={cn(
              'px-3 py-2 rounded-lg text-xs font-medium transition-all',
              activeTab === s
                ? 'bg-brand-blue text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl">
        <div className="p-4 border-b border-white/5">
          <div className="max-w-sm">
            <Input
              placeholder="Search by customer, car, ID..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchRaw}
              onChange={(e) => {
                setSearchRaw(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="p-4">
          <DataTable
            data={bookings}
            columns={columns}
            loading={isLoading}
            onRowClick={setSelectedBooking}
            keyExtractor={(b) => b.id}
            emptyTitle="No bookings found"
            emptyDescription="No bookings match your current filters."
          />
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-center gap-2">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                    p === page
                      ? 'bg-brand-blue text-white'
                      : 'text-white/40 hover:text-white hover:bg-white/10',
                  )}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      <SlideOver
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-white/40">
                {generateBookingRef(selectedBooking.id)}
              </p>
              <Badge variant="booking" status={selectedBooking.status}>
                {selectedBooking.status}
              </Badge>
            </div>

            {selectedBooking.car && (
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  {selectedBooking.car.images?.[0] && (
                    <img
                      src={selectedBooking.car.images[0]}
                      alt=""
                      className="w-16 h-11 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">
                      {selectedBooking.car.make} {selectedBooking.car.model}
                    </p>
                    <p className="text-xs text-white/40">
                      {selectedBooking.car.year}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedBooking.user && (
              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-white/40 uppercase">
                  Customer
                </p>
                <p className="text-white">
                  {selectedBooking.user.firstName}{' '}
                  {selectedBooking.user.lastName}
                </p>
                <p className="text-white/50">{selectedBooking.user.email}</p>
                {selectedBooking.user.phone && (
                  <p className="text-white/50">{selectedBooking.user.phone}</p>
                )}
              </div>
            )}

            <div className="space-y-2 text-sm">
              {[
                {
                  label: 'Pick-up',
                  value: `${formatDate(selectedBooking.pickupDate)} — ${selectedBooking.pickupLocation}`,
                },
                {
                  label: 'Return',
                  value: `${formatDate(selectedBooking.returnDate)} — ${selectedBooking.returnLocation}`,
                },
                {
                  label: 'Duration',
                  value: `${selectedBooking.totalDays} day(s)`,
                },
                { label: 'Payment', value: selectedBooking.paymentStatus },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-white/40">{item.label}</span>
                  <span className="text-white">{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                <span className="text-white">Total</span>
                <span className="text-white">
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>
            </div>

            {statusActions[selectedBooking.status] && (
              <div className="flex gap-2 flex-wrap">
                {statusActions[selectedBooking.status].map((action) => (
                  <Button
                    key={action.status}
                    variant={action.variant}
                    size="sm"
                    loading={updateStatus.isPending}
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, action.status)
                    }
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            {selectedBooking.cancellationReason && (
              <div className="p-3 rounded-xl bg-brand-rose/10 border border-brand-rose/20">
                <p className="text-xs text-brand-rose font-medium mb-1">
                  Cancellation Reason
                </p>
                <p className="text-sm text-white/70">
                  {selectedBooking.cancellationReason}
                </p>
              </div>
            )}
          </div>
        )}
      </SlideOver>
    </div>
  );
};

export default BookingsPage;
