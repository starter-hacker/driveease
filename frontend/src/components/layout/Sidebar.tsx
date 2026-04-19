// FILE: frontend/src/components/layout/Sidebar.tsx

import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useLogout } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Fleet', icon: Car, to: '/admin/fleet' },
  { label: 'Bookings', icon: CalendarCheck, to: '/admin/bookings' },
  { label: 'Customers', icon: Users, to: '/admin/customers' },
  { label: 'Analytics', icon: BarChart3, to: '/admin/analytics' },
  { label: 'Settings', icon: Settings, to: '/admin/settings' },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const logout = useLogout();

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 220 : 60 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="bg-ink-3 border-r border-hairline h-screen flex flex-col sticky top-0 z-40 shrink-0 overflow-hidden"
    >
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-hairline gap-3 shrink-0">
        <div className="w-6 h-6 border border-gold flex items-center justify-center shrink-0">
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path
              d="M1 9L4 4L6 7L8 4L11 9"
              stroke="#C9A96E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-medium tracking-[0.14em] uppercase text-stone whitespace-nowrap"
            >
              DriveEase
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="ml-auto p-1 text-stone-5 hover:text-stone transition-colors shrink-0"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-hidden">
        {!sidebarOpen && (
          <div className="px-3 mb-2">
            <div className="h-px bg-hairline w-full" />
          </div>
        )}
        {sidebarOpen && (
          <p className="text-[9px] font-medium tracking-[0.16em] uppercase text-faint px-6 mb-3">
            Navigation
          </p>
        )}
        {nav.map((item) => {
          const active =
            item.to === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              title={!sidebarOpen ? item.label : undefined}
              className={cn(
                'nav-item',
                !sidebarOpen && 'justify-center px-0',
                active && 'active',
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[13px] whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-hairline p-3 shrink-0">
        {sidebarOpen && user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
            <div className="w-6 h-6 bg-gold/15 flex items-center justify-center text-gold text-[10px] font-medium shrink-0">
              {getInitials(user)}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-stone truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-faint tracking-wide">
                {user.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => logout.mutate()}
          title={!sidebarOpen ? 'Sign out' : undefined}
          className={cn(
            'nav-item w-full hover:text-[#EB5757] hover:bg-[rgba(235,87,87,0.05)]',
            !sidebarOpen && 'justify-center px-0',
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};
