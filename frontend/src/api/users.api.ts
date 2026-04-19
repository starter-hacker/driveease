// FILE: frontend/src/api/users.api.ts

import apiClient from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, User, UserStats } from '@/types';

export const usersApi = {
  getUsers: (params?: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<PaginatedResponse<User>>('/users', { params }),

  getUserById: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),

  updateUser: (id: string, data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/users/${id}`),

  getUserBookings: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/users/${id}/bookings`, { params }),

  getUserStats: (id: string) =>
    apiClient.get<ApiResponse<UserStats>>(`/users/${id}/stats`),
};
