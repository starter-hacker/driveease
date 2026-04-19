// FILE: frontend/src/pages/admin/DashboardPage.tsx

import { motion } from 'framer-motion';
import {
  DollarSign,
  Car,
  CalendarCheck,
  Users,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Legend,
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

const CHART_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#F43F5E',
  '#8B5CF6',
  '#06B6D4',
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
    <div className="glass-card rounded-xl p-3 border border-white/10 text-sm">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-semibold text-white">
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
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subheader">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              iconColor="text-brand-emerald"
              iconBg="bg-brand-emerald/10"
              subtitle="All completed bookings"
              delay={0}
            />
            <StatCard
              title="Active Rentals"
              value={stats.activeRentals}
              icon={Car}
              iconColor="text-brand-blue"
              iconBg="bg-brand-blue/10"
              subtitle={`${stats.fleetUtilization}% fleet utilization`}
              delay={0.08}
            />
            <StatCard
              title="Available Cars"
              value={stats.availableCars}
              icon={Activity}
              iconColor="text-brand-amber"
              iconBg="bg-brand-amber/10"
              subtitle={`${stats.pendingBookings} pending bookings`}
              delay={0.16}
            />
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers.toLocaleString()}
              icon={Users}
              iconColor="text-violet-400"
              iconBg="bg-violet-400/10"
              subtitle="Registered customers"
              delay={0.24}
            />
          </>
        ) : null}
      </div>

      {/* Charts row 1 */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 glass-card rounded-2xl p-6"
        >
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-blue" />
            Revenue — Last 12 Months
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue} barSize={20}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fleet pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-semibold text-white mb-5">Fleet Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={fleet}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {fleet.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {fleet.slice(0, 5).map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                  <span className="text-white/60">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-semibold text-white mb-5">Booking Trends</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="week"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#3B82F6"
                fill="url(#trendGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="xl:col-span-2 glass-card rounded-2xl p-6"
        >
          <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {(activity as Booking[]).slice(0, 6).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors"
              >
                {booking.car?.images?.[0] && (
                  <img
                    src={booking.car.images[0]}
                    alt=""
                    className="w-10 h-7 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {booking.user
                      ? `${booking.user.firstName} ${booking.user.lastName}`
                      : 'Customer'}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {booking.car
                      ? `${booking.car.make} ${booking.car.model}`
                      : 'Car'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    variant="booking"
                    status={booking.status}
                    className="text-[10px]"
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-xs text-white/40 mt-0.5">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="font-semibold text-white mb-4">
          Top 5 Most Booked Cars
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Car', 'Category', 'Price/Day', 'Rating', 'Bookings'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 text-xs text-white/40 font-semibold uppercase"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {(topCars as (CarType & { _count: { bookings: number } })[]).map(
                (car, i) => (
                  <tr
                    key={car.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white/20 text-sm font-mono w-4">
                          {i + 1}
                        </span>
                        {car.images?.[0] && (
                          <img
                            src={car.images[0]}
                            alt=""
                            className="w-10 h-7 rounded-lg object-cover"
                          />
                        )}
                        <span className="text-sm text-white font-medium">
                          {car.make} {car.model} {car.year}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge>{car.category}</Badge>
                    </td>
                    <td className="py-3 px-3 text-sm text-white/70">
                      {formatCurrency(Number(car.pricePerDay))}
                    </td>
                    <td className="py-3 px-3 text-sm text-brand-amber font-medium">
                      ⭐ {Number(car.rating).toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-sm text-brand-emerald font-bold">
                      {car._count?.bookings}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
