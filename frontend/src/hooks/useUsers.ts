// FILE: frontend/src/hooks/useUsers.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersApi } from '@/api/users.api';
import type { User } from '@/types';

export const useUsers = (params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params).then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUserById(id).then((r) => r.data.data),
    enabled: !!id,
  });

export const useUserStats = (id: string) =>
  useQuery({
    queryKey: ['user-stats', id],
    queryFn: () => usersApi.getUserStats(id).then((r) => r.data.data),
    enabled: !!id,
  });

export const useUserBookings = (id: string, params?: { page?: number }) =>
  useQuery({
    queryKey: ['user-bookings', id, params],
    queryFn: () => usersApi.getUserBookings(id, params).then((r) => r.data),
    enabled: !!id,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['user', id] });
      toast.success('User updated');
    },
    onError: () => toast.error('Failed to update user'),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deactivated');
    },
    onError: () => toast.error('Failed to deactivate user'),
  });
};
