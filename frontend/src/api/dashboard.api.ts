// FILE: frontend/src/api/dashboard.api.ts

import apiClient from '@/lib/axios';
import type {
  ApiResponse,
  DashboardStats,
  RevenueData,
  BookingTrend,
  FleetBreakdown,
} from '@/types';

export const dashboardApi = {
  getOverviewStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/dashboard/overview'),

  getRevenueChart: () =>
    apiClient.get<ApiResponse<RevenueData[]>>('/dashboard/revenue'),

  getBookingTrends: () =>
    apiClient.get<ApiResponse<BookingTrend[]>>('/dashboard/trends'),

  getFleetBreakdown: () =>
    apiClient.get<ApiResponse<FleetBreakdown[]>>('/dashboard/fleet'),

  getRecentActivity: () =>
    apiClient.get<ApiResponse<unknown[]>>('/dashboard/activity'),

  getTopCars: () =>
    apiClient.get<ApiResponse<unknown[]>>('/dashboard/top-cars'),
};
