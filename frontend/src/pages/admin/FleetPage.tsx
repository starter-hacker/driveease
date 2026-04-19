// FILE: frontend/src/pages/admin/FleetPage.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Car, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  useCars,
  useCreateCar,
  useUpdateCar,
  useDeleteCar,
} from '@/hooks/useCars';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency } from '@/lib/utils';
import type { Car, CarCategory, Transmission, FuelType } from '@/types';
import { cn } from '@/lib/utils';

const carSchema = z.object({
  make: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  year: z.string().min(4, 'Required'),
  category: z.enum(['ECONOMY', 'COMPACT', 'SUV', 'LUXURY', 'VAN', 'ELECTRIC']),
  pricePerDay: z.string().min(1, 'Required'),
  pricePerWeek: z.string().min(1, 'Required'),
  seats: z.string().min(1, 'Required'),
  transmission: z.enum(['AUTO', 'MANUAL']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
  color: z.string().min(1, 'Required'),
  licensePlate: z.string().min(1, 'Required'),
  vin: z.string().min(1, 'Required'),
  description: z.string().optional(),
  features: z.string().optional(),
});

type CarFormData = z.infer<typeof carSchema>;

const statusTabs = [
  'ALL',
  'AVAILABLE',
  'RENTED',
  'MAINTENANCE',
  'RETIRED',
] as const;

const FleetPage = () => {
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw, 400);
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusTabs)[number]>('ALL');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [deleteCar, setDeleteCar] = useState<Car | null>(null);

  const { data, isLoading } = useCars({
    search,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page,
    limit: 10,
  });

  const cars = data?.data || [];
  const meta = data?.meta;

  const createCar = useCreateCar();
  const updateCar = useUpdateCar();
  const deleteMutation = useDeleteCar();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      category: 'COMPACT',
      transmission: 'AUTO',
      fuelType: 'PETROL',
    },
  });

  const openCreate = () => {
    reset();
    setEditCar(null);
    setModalOpen(true);
  };
  const openEdit = (car: Car) => {
    setEditCar(car);
    Object.entries({
      make: car.make,
      model: car.model,
      year: String(car.year),
      category: car.category,
      pricePerDay: String(car.pricePerDay),
      pricePerWeek: String(car.pricePerWeek),
      seats: String(car.seats),
      transmission: car.transmission,
      fuelType: car.fuelType,
      color: car.color,
      licensePlate: car.licensePlate,
      vin: car.vin,
      description: car.description || '',
      features: car.features.join(', '),
    }).forEach(([k, v]) => setValue(k as keyof CarFormData, v));
    setModalOpen(true);
  };

  const onSubmit = (data: CarFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v) formData.append(k, v);
    });
    if (editCar) {
      updateCar.mutate(
        { id: editCar.id, data: formData },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createCar.mutate(formData, { onSuccess: () => setModalOpen(false) });
    }
  };

  const columns = [
    {
      key: 'images',
      header: 'Car',
      cell: (car: Car) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-10 rounded-lg overflow-hidden bg-navy-800 shrink-0">
            {car.images[0] ? (
              <img
                src={car.images[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/10">
                <Car className="w-5 h-5" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {car.make} {car.model}
            </p>
            <p className="text-xs text-white/40">
              {car.year} · {car.licensePlate}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (car: Car) => <Badge>{car.category}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (car: Car) => (
        <Badge variant="car" status={car.status}>
          {car.status}
        </Badge>
      ),
    },
    {
      key: 'pricePerDay',
      header: 'Price/Day',
      cell: (car: Car) => (
        <span className="text-white font-medium">
          {formatCurrency(Number(car.pricePerDay))}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'rating',
      header: 'Rating',
      cell: (car: Car) => (
        <span className="text-brand-amber text-sm">
          ⭐ {Number(car.rating).toFixed(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (car: Car) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(car);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteCar(car);
            }}
            className="p-1.5 rounded-lg hover:bg-brand-rose/10 text-white/40 hover:text-brand-rose transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Fleet Management</h1>
          <p className="page-subheader">
            {meta ? `${meta.total} cars in fleet` : 'Loading...'}
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Car
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 glass-card rounded-xl p-1 border border-white/5 w-fit">
        {statusTabs.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              statusFilter === s
                ? 'bg-brand-blue text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl">
        <div className="p-4 border-b border-white/5">
          <div className="max-w-sm">
            <Input
              placeholder="Search make, model, plate..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchRaw}
              onChange={(e) => {
                setSearchRaw(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="p-4">
          <DataTable
            data={cars}
            columns={columns}
            loading={isLoading}
            keyExtractor={(car) => car.id}
            emptyTitle="No cars found"
            emptyDescription="Add your first car to the fleet."
          />
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                      p === page
                        ? 'bg-brand-blue text-white'
                        : 'text-white/40 hover:text-white hover:bg-white/10',
                    )}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      {/* Car form modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCar ? 'Edit Car' : 'Add New Car'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Make"
              placeholder="Toyota"
              error={errors.make?.message}
              {...register('make')}
            />
            <Input
              label="Model"
              placeholder="Camry"
              error={errors.model?.message}
              {...register('model')}
            />
            <Input
              label="Year"
              placeholder="2023"
              error={errors.year?.message}
              {...register('year')}
            />
            <Input
              label="Color"
              placeholder="Pearl White"
              error={errors.color?.message}
              {...register('color')}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-white/50 uppercase mb-1.5 block">
                Category
              </label>
              <select className="input-dark text-sm" {...register('category')}>
                {['ECONOMY', 'COMPACT', 'SUV', 'LUXURY', 'VAN', 'ELECTRIC'].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 uppercase mb-1.5 block">
                Transmission
              </label>
              <select
                className="input-dark text-sm"
                {...register('transmission')}
              >
                <option value="AUTO">AUTO</option>
                <option value="MANUAL">MANUAL</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 uppercase mb-1.5 block">
                Fuel Type
              </label>
              <select className="input-dark text-sm" {...register('fuelType')}>
                {['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Price / Day (₦)"
              placeholder="25000"
              error={errors.pricePerDay?.message}
              {...register('pricePerDay')}
            />
            <Input
              label="Price / Week (₦)"
              placeholder="150000"
              error={errors.pricePerWeek?.message}
              {...register('pricePerWeek')}
            />
            <Input
              label="Seats"
              placeholder="5"
              error={errors.seats?.message}
              {...register('seats')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="License Plate"
              placeholder="LAG-234-AB"
              error={errors.licensePlate?.message}
              {...register('licensePlate')}
            />
            <Input
              label="VIN"
              placeholder="JT2BF22K1W0123456"
              error={errors.vin?.message}
              {...register('vin')}
            />
          </div>
          <Input
            label="Features (comma-separated)"
            placeholder="Air Conditioning, Bluetooth, GPS"
            {...register('features')}
          />
          <div>
            <label className="text-xs font-medium text-white/50 uppercase mb-1.5 block">
              Description
            </label>
            <textarea
              className="input-dark text-sm min-h-[80px] resize-none"
              placeholder="Brief description of the car..."
              {...register('description')}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createCar.isPending || updateCar.isPending}
            >
              {editCar ? 'Update Car' : 'Add to Fleet'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteCar}
        onClose={() => setDeleteCar(null)}
        onConfirm={() => {
          if (deleteCar) {
            deleteMutation.mutate(deleteCar.id, {
              onSuccess: () => setDeleteCar(null),
            });
          }
        }}
        title="Retire Car"
        message={`Are you sure you want to retire ${deleteCar?.make} ${deleteCar?.model}? The car will be marked as retired and removed from the booking catalog.`}
        confirmLabel="Retire Car"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default FleetPage;
