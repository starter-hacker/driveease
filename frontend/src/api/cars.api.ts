// FILE: frontend/src/api/cars.api.ts

import apiClient from '@/lib/axios';
import type { ApiResponse, Car, PaginatedResponse, CarFilters } from '@/types';

export const carsApi = {
  getCars: (filters?: CarFilters) =>
    apiClient.get<PaginatedResponse<Car>>('/cars', { params: filters }),

  getCarById: (id: string) => apiClient.get<ApiResponse<Car>>(`/cars/${id}`),

  getCarAvailability: (id: string, startDate: string, endDate: string) =>
    apiClient.get<
      ApiResponse<{ isAvailable: boolean; conflictingPeriods: unknown[] }>
    >(`/cars/${id}/availability`, { params: { startDate, endDate } }),

  createCar: (data: FormData) =>
    apiClient.post<ApiResponse<Car>>('/cars', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateCar: (id: string, data: Partial<Car> | FormData) =>
    apiClient.patch<ApiResponse<Car>>(`/cars/${id}`, data),

  deleteCar: (id: string) => apiClient.delete<ApiResponse<null>>(`/cars/${id}`),

  uploadCarImages: (id: string, formData: FormData) =>
    apiClient.post<ApiResponse<{ images: string[] }>>(
      `/cars/${id}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ),
};
