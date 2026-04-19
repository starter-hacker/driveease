// FILE: frontend/src/hooks/useNotifications.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications.api';
import { useAuthStore } from '@/store/authStore';

export const useNotifications = (params?: {
  page?: number;
  limit?: number;
}) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () =>
      notificationsApi.getNotifications(params).then((r) => r.data),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
};

export const useUnreadCount = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () =>
      notificationsApi.getUnreadCount().then((r) => r.data.data.count),
    enabled: isAuthenticated,
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
};

export const useMarkAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
};
