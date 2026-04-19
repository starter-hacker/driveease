// FILE: frontend/src/hooks/useBookings.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bookingsApi, type CreateBookingData } from '@/api/bookings.api';
import type { BookingFilters } from '@/types';

export const useBookings = (filters?: BookingFilters) =>
  useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingsApi.getBookings(filters).then((r) => r.data),
    staleTime: 60 * 1000,
  });

export const useBooking = (id: string) =>
  useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getBookingById(id).then((r) => r.data.data),
    enabled: !!id,
  });

export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingData) => bookingsApi.createBooking(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['cars'] });
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to create booking';
      toast.error(msg);
    },
  });
};

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        status?: string;
        paymentStatus?: string;
        paymentReference?: string;
      };
    }) => bookingsApi.updateBookingStatus(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Booking status updated');
    },
    onError: () => toast.error('Failed to update booking'),
  });
};

export const useCancelBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingsApi.cancelBooking(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking cancelled');
    },
    onError: () => toast.error('Failed to cancel booking'),
  });
};

export const useBookingStats = () =>
  useQuery({
    queryKey: ['booking-stats'],
    queryFn: () => bookingsApi.getBookingStats().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
