// FILE: frontend/src/hooks/useDashboard.ts

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard.api';

export const useOverviewStats = () =>
  useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardApi.getOverviewStats().then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

export const useRevenueChart = () =>
  useQuery({
    queryKey: ['dashboard-revenue'],
    queryFn: () => dashboardApi.getRevenueChart().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export const useBookingTrends = () =>
  useQuery({
    queryKey: ['dashboard-trends'],
    queryFn: () => dashboardApi.getBookingTrends().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export const useFleetBreakdown = () =>
  useQuery({
    queryKey: ['dashboard-fleet'],
    queryFn: () => dashboardApi.getFleetBreakdown().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export const useRecentActivity = () =>
  useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => dashboardApi.getRecentActivity().then((r) => r.data.data),
    staleTime: 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
  });

export const useTopCars = () =>
  useQuery({
    queryKey: ['dashboard-top-cars'],
    queryFn: () => dashboardApi.getTopCars().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
