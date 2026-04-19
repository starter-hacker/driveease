// FILE: frontend/src/api/notifications.api.ts

import apiClient from '@/lib/axios';
import type { ApiResponse, Notification, PaginatedResponse } from '@/types';

export const notificationsApi = {
  getNotifications: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Notification>>('/notifications', {
      params,
    }),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>(
      '/notifications/unread-count',
    ),

  markAsRead: (id: string) =>
    apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.patch<ApiResponse<null>>('/notifications/read-all'),
};
