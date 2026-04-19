// FILE: frontend/src/pages/admin/CustomerDetailPage.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Phone, CreditCard, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { BookingCard } from '@/components/shared/BookingCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useUser, useUserStats, useUserBookings } from '@/hooks/useUsers';
import {
  formatCurrency,
  getInitials,
  getLoyaltyTierBadge,
  formatDate,
} from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Booking } from '@/types';

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id!);
  const { data: stats } = useUserStats(id!);
  const { data: bookingsData } = useUserBookings(id!);
  const bookings = (bookingsData?.data || []) as Booking[];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/admin/customers')}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Customers
      </button>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue text-xl font-bold shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              getInitials(user)
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/50 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {user.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
              <Badge
                className={cn('border', getLoyaltyTierBadge(user.loyaltyTier))}
              >
                {user.loyaltyTier} Member
              </Badge>
            </div>

            {stats && (
              <div className="grid grid-cols-3 gap-4 mt-5">
                {[
                  {
                    icon: Calendar,
                    label: 'Total Bookings',
                    value: stats.totalBookings,
                  },
                  {
                    icon: CreditCard,
                    label: 'Completed',
                    value: stats.completedBookings,
                  },
                  {
                    icon: CreditCard,
                    label: 'Total Spent',
                    value: formatCurrency(stats.totalSpent),
                  },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/40 mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Booking history */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Booking History
        </h2>
        <div className="space-y-4">
          {bookings.map((booking, i) => (
            <BookingCard key={booking.id} booking={booking} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
