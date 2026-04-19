// FILE: frontend/src/types/index.ts

export type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER';
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type CarCategory =
  | 'ECONOMY'
  | 'COMPACT'
  | 'SUV'
  | 'LUXURY'
  | 'VAN'
  | 'ELECTRIC';
export type Transmission = 'AUTO' | 'MANUAL';
export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
export type CarStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'RETIRED';
export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  driverLicense?: string;
  dateOfBirth?: string;
  loyaltyTier: LoyaltyTier;
  isActive: boolean;
  createdAt: string;
  _count?: { bookings: number };
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  pricePerWeek: number;
  seats: number;
  transmission: Transmission;
  fuelType: FuelType;
  mileage: number;
  color: string;
  images: string[];
  status: CarStatus;
  features: string[];
  rating: number;
  reviewCount: number;
  licensePlate: string;
  vin: string;
  description?: string;
  createdAt: string;
  _count?: { bookings: number };
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalDays: number;
  dailyRate: number;
  insuranceIncluded: boolean;
  gpsIncluded: boolean;
  childSeatIncluded: boolean;
  insuranceCost: number;
  gpsCost: number;
  childSeatCost: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<
    User,
    'id' | 'firstName' | 'lastName' | 'email' | 'avatar' | 'phone'
  >;
  car?: Pick<
    Car,
    'id' | 'make' | 'model' | 'year' | 'category' | 'images' | 'licensePlate'
  >;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  reference?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CarFilters {
  category?: CarCategory;
  status?: CarStatus;
  priceMin?: number;
  priceMax?: number;
  seats?: number;
  transmission?: Transmission;
  fuelType?: FuelType;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BookingFilters {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalRevenue: number;
  activeRentals: number;
  availableCars: number;
  totalCustomers: number;
  totalCars: number;
  pendingBookings: number;
  fleetUtilization: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface BookingTrend {
  week: string;
  bookings: number;
}

export interface FleetBreakdown {
  name: string;
  value: number;
}

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  totalSpent: number;
  loyaltyTier: LoyaltyTier;
}
