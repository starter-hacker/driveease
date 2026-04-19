// FILE: frontend/src/api/auth.api.ts

import apiClient from '@/lib/axios';
import type { ApiResponse, AuthResponse, User } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data),

  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken },
    ),

  getMe: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  updateProfile: (data: FormData | Record<string, unknown>) =>
    apiClient.patch<ApiResponse<User>>('/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch('/auth/change-password', { currentPassword, newPassword }),
};
