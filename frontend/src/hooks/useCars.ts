// FILE: frontend/src/hooks/useCars.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { carsApi } from '@/api/cars.api';
import type { CarFilters } from '@/types';

export const useCars = (filters?: CarFilters) =>
  useQuery({
    queryKey: ['cars', filters],
    queryFn: () => carsApi.getCars(filters).then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });

export const useCar = (id: string) =>
  useQuery({
    queryKey: ['car', id],
    queryFn: () => carsApi.getCarById(id).then((r) => r.data.data),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });

export const useCarAvailability = (
  id: string,
  startDate: string,
  endDate: string,
) =>
  useQuery({
    queryKey: ['car-availability', id, startDate, endDate],
    queryFn: () =>
      carsApi
        .getCarAvailability(id, startDate, endDate)
        .then((r) => r.data.data),
    enabled: !!id && !!startDate && !!endDate,
  });

export const useCreateCar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => carsApi.createCar(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cars'] });
      toast.success('Car added to fleet!');
    },
    onError: () => toast.error('Failed to add car'),
  });
};

export const useUpdateCar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData | Record<string, unknown>;
    }) => carsApi.updateCar(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['cars'] });
      qc.invalidateQueries({ queryKey: ['car', id] });
      toast.success('Car updated successfully');
    },
    onError: () => toast.error('Failed to update car'),
  });
};

export const useDeleteCar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carsApi.deleteCar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cars'] });
      toast.success('Car retired from fleet');
    },
    onError: () => toast.error('Failed to retire car'),
  });
};
