// FILE: frontend/src/pages/admin/AnalyticsPage.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'recharts';
import { Button } from '@/components/ui/Button';
import {
  useRevenueChart,
  useBookingTrends,
  useFleetBreakdown,
} from '@/hooks/useDashboard';
import { useBookingStats } from '@/hooks/useBookings';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#F43F5E',
  '#8B5CF6',
  '#06B6D4',
];
type ChartType = 'bar' | 'line' | 'area';

const AnalyticsPage = () => {
  const [revenueChartType, setRevenueChartType] = useState<ChartType>('bar');
  const { data: revenue = [] } = useRevenueChart();
  const { data: trends = [] } = useBookingTrends();
  const { data: fleet = [] } = useFleetBreakdown();
  const { data: bookingStats } = useBookingStats();

  const statusData =
    (
      bookingStats as {
        statusCounts?: { status: string; _count: { status: number } }[];
      }
    )?.statusCounts || [];

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
            {p.name === 'revenue' ? formatCurrency(p.value) : p.value}{' '}
            {p.name !== 'revenue' && 'bookings'}
          </p>
        ))}
      </div>
    );
  };

  const renderRevenueChart = () => {
    const commonProps = {
      data: revenue,
      children: (
        <>
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
        </>
      ),
    };

    if (revenueChartType === 'line') {
      return (
        <LineChart {...commonProps}>
          {commonProps.children}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      );
    }

    if (revenueChartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          {commonProps.children}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            fill="url(#grad)"
            strokeWidth={2}
          />
        </AreaChart>
      );
    }

    return (
      <BarChart {...commonProps} barSize={20}>
        {commonProps.children}
        <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
      </BarChart>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Analytics</h1>
        <p className="page-subheader">Performance insights and trends</p>
      </div>

      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Monthly Revenue</h3>
          <div className="flex items-center gap-1 glass-card rounded-xl p-1 border border-white/10">
            {(['bar', 'line', 'area'] as ChartType[]).map((t) => (
              <button
                key={t}
                onClick={() => setRevenueChartType(t)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                  revenueChartType === t
                    ? 'bg-brand-blue text-white'
                    : 'text-white/40 hover:text-white',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          {renderRevenueChart()}
        </ResponsiveContainer>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Booking trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-semibold text-white mb-5">
            Weekly Booking Trends
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                stroke="#10B981"
                fill="url(#tGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Booking status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-semibold text-white mb-5">
            Booking Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={statusData.map((s) => ({
                  name: s.status,
                  value: s._count.status,
                }))}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-3">
            {statusData.map((s, i) => (
              <div key={s.status} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-white/50">{s.status}</span>
                <span className="text-white font-medium ml-auto">
                  {s._count.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fleet performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="font-semibold text-white mb-5">Fleet by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={fleet} barSize={32}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {fleet.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
