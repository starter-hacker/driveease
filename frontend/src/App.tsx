// FILE: frontend/src/App.tsx

import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { RootLayout } from '@/components/layout/RootLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';

// Lazy load pages
const LandingPage = lazy(() => import('@/pages/customer/LandingPage'));
const CatalogPage = lazy(() => import('@/pages/customer/CatalogPage'));
const CarDetailPage = lazy(() => import('@/pages/customer/CarDetailPage'));
const BookingPage = lazy(() => import('@/pages/customer/BookingPage'));
const MyBookingsPage = lazy(() => import('@/pages/customer/MyBookingsPage'));
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'));
const FleetPage = lazy(() => import('@/pages/admin/FleetPage'));
const BookingsPage = lazy(() => import('@/pages/admin/BookingsPage'));
const CustomersPage = lazy(() => import('@/pages/admin/CustomersPage'));
const CustomerDetailPage = lazy(
  () => import('@/pages/admin/CustomerDetailPage'),
);
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageLoader = () => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/cars" element={<CatalogPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected customer routes */}
          <Route
            path="/book/:carId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN', 'STAFF']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="fleet" element={<FleetPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
