// FILE: frontend/src/pages/admin/DashboardPage.tsx

import { motion } from 'framer-motion';
import { DollarSign, Car, Users, Activity, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import {
  useOverviewStats,
  useRevenueChart,
  useBookingTrends,
  useFleetBreakdown,
  useRecentActivity,
  useTopCars,
} from '@/hooks/useDashboard';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import type { Booking, Car as CarType } from '@/types';

const COLORS = [
  '#C9A96E',
  '#4A7FD4',
  '#6FCF97',
  '#F2C94C',
  '#EB5757',
  '#56CCF2',
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
  label?: string;
}) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-ink-3 border border-hairline p-3 text-sm">
      <p className="text-muted mb-1 text-[11px] uppercase tracking-wide">
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="font-light text-stone">
          {p.name === 'revenue' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useOverviewStats();
  const { data: revenue = [] } = useRevenueChart();
  const { data: trends = [] } = useBookingTrends();
  const { data: fleet = [] } = useFleetBreakdown();
  const { data: activity = [] } = useRecentActivity();
  const { data: topCars = [] } = useTopCars();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-stone tracking-tight">
          Dashboard
        </h1>
        <p className="text-[12px] text-faint mt-1 tracking-wide">
          {new Date().toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* KPI cards */}
      <div className="hairline-grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              iconColor="text-gold"
              subtitle="All completed bookings"
              delay={0}
            />
            <StatCard
              title="Active Rentals"
              value={stats.activeRentals}
              icon={Car}
              iconColor="text-status-blue"
              subtitle={`${stats.fleetUtilization}% fleet utilization`}
              delay={0.08}
            />
            <StatCard
              title="Available Cars"
              value={stats.availableCars}
              icon={Activity}
              iconColor="text-status-amber"
              subtitle={`${stats.pendingBookings} pending bookings`}
              delay={0.16}
            />
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers.toLocaleString()}
              icon={Users}
              iconColor="text-stone-5"
              subtitle="Registered customers"
              delay={0.24}
            />
          </>
        ) : null}
      </div>

      {/* Charts row 1 */}
      <div
        className="hairline-grid"
        style={{ gridTemplateColumns: '1fr 260px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-ink-2 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] tracking-[0.1em] uppercase text-muted">
              Revenue — last 12 months
            </p>
            {stats && (
              <p className="text-[12px] text-gold">
                {formatCurrency(stats.totalRevenue)} total
              </p>
            )}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenue} barSize={16}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(248,247,244,0.3)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                tick={{ fill: 'rgba(248,247,244,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                fill="#C9A96E"
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-ink-2 p-6"
        >
          <p className="text-[11px] tracking-[0.1em] uppercase text-muted mb-5">
            Fleet breakdown
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={fleet}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {fleet.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {fleet.slice(0, 5).map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-[11px] text-muted">{item.name}</span>
                </div>
                <span className="text-[12px] text-stone">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div
        className="hairline-grid"
        style={{ gridTemplateColumns: '300px 1fr' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-ink-2 p-6"
        >
          <p className="text-[11px] tracking-[0.1em] uppercase text-muted mb-5">
            Booking trends
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="week"
                tick={{ fill: 'rgba(248,247,244,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(248,247,244,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#C9A96E"
                fill="url(#tGrad)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-ink-2 p-6"
        >
          <p className="text-[11px] tracking-[0.1em] uppercase text-muted mb-4">
            Recent activity
          </p>
          <div className="space-y-1">
            {(activity as Booking[]).slice(0, 6).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-3 py-2.5 border-b border-hairline last:border-0"
              >
                {booking.car?.images?.[0] && (
                  <img
                    src={booking.car.images[0]}
                    alt=""
                    className="w-10 h-7 object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-stone truncate">
                    {booking.user
                      ? `${booking.user.firstName} ${booking.user.lastName}`
                      : 'Customer'}
                  </p>
                  <p className="text-[11px] text-faint truncate">
                    {booking.car
                      ? `${booking.car.make} ${booking.car.model}`
                      : 'Car'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    variant="booking"
                    status={booking.status}
                    className="text-[9px]"
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-[10px] text-faint mt-0.5">
                    {formatRelativeTime(booking.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top cars */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-ink-3 border border-hairline"
      >
        <div className="px-5 py-4 border-b border-hairline">
          <p className="text-[11px] tracking-[0.1em] uppercase text-muted">
            Top 5 most booked cars
          </p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              {['Vehicle', 'Category', 'Price/Day', 'Rating', 'Bookings'].map(
                (h) => (
                  <th key={h}>{h}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {(topCars as (CarType & { _count: { bookings: number } })[]).map(
              (car, i) => (
                <tr key={car.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-faint text-[11px] w-4">
                        {i + 1}
                      </span>
                      {car.images?.[0] && (
                        <img
                          src={car.images[0]}
                          alt=""
                          className="w-10 h-7 object-cover"
                        />
                      )}
                      <span className="text-[13px] text-stone">
                        {car.make} {car.model} {car.year}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Badge>{car.category}</Badge>
                  </td>
                  <td className="text-stone">
                    {formatCurrency(Number(car.pricePerDay))}
                  </td>
                  <td className="text-gold">{Number(car.rating).toFixed(1)}</td>
                  <td className="text-status-green font-medium">
                    {car._count?.bookings}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
