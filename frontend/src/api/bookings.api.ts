// FILE: frontend/src/api/bookings.api.ts

import apiClient from '@/lib/axios';
import type {
  ApiResponse,
  Booking,
  PaginatedResponse,
  BookingFilters,
} from '@/types';

export interface CreateBookingData {
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  insuranceIncluded?: boolean;
  gpsIncluded?: boolean;
  childSeatIncluded?: boolean;
  notes?: string;
}

export const bookingsApi = {
  getBookings: (filters?: BookingFilters) =>
    apiClient.get<PaginatedResponse<Booking>>('/bookings', { params: filters }),

  getBookingById: (id: string) =>
    apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`),

  createBooking: (data: CreateBookingData) =>
    apiClient.post<ApiResponse<Booking>>('/bookings', data),

  updateBookingStatus: (
    id: string,
    data: {
      status?: string;
      paymentStatus?: string;
      paymentReference?: string;
    },
  ) => apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, data),

  cancelBooking: (id: string, cancellationReason?: string) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`, {
      cancellationReason,
    }),

  getBookingStats: () => apiClient.get<ApiResponse<unknown>>('/bookings/stats'),
};
