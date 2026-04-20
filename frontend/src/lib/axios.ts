// FILE: frontend/src/lib/axios.ts
/// <reference types="vite/client" />

import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://driveease-production.up.railway.app/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('driveease-auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (val: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const stored = localStorage.getItem('driveease-auth');
        const refreshToken = stored
          ? JSON.parse(stored)?.state?.refreshToken
          : null;

        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        const authData = JSON.parse(
          localStorage.getItem('driveease-auth') || '{}',
        );
        if (authData.state) {
          authData.state.accessToken = accessToken;
          authData.state.refreshToken = newRefreshToken;
          localStorage.setItem('driveease-auth', JSON.stringify(authData));
        }

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('driveease-auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  },
);

export default apiClient;
