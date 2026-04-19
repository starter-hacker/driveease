// FILE: frontend/src/hooks/useAuth.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';

export const useLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data.data;
      login(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.firstName}!`);
      if (user.role === 'ADMIN' || user.role === 'STAFF') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Login failed';
      toast.error(msg);
    },
  });
};

export const useRegister = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }) => authApi.register(data),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data.data;
      login(user, accessToken, refreshToken);
      toast.success('Account created! Welcome to DriveEase 🚗');
      navigate('/');
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Registration failed';
      toast.error(msg);
    },
  });
};

export const useLogout = () => {
  const { logout, refreshToken } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(refreshToken || ''),
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate('/login');
      toast.success('Logged out successfully');
    },
  });
};

export const useGetMe = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe().then((r) => r.data.data),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | Record<string, unknown>) =>
      authApi.updateProfile(data),
    onSuccess: (response) => {
      updateUser(response.data.data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => toast.success('Password changed. Please log in again.'),
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to change password';
      toast.error(msg);
    },
  });
