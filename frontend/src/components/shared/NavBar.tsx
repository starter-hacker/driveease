// FILE: frontend/src/components/shared/NavBar.tsx

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const links = [
  { label: 'Fleet', to: '/cars' },
  { label: 'Bookings', to: '/my-bookings', auth: true },
  { label: 'About', to: '#' },
];

export const NavBar = () => {
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <nav className="bg-ink-2/95 border-b border-hairline sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-6 h-6 border border-gold flex items-center justify-center">
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
              <path
                d="M1 9L4 4L6 7L8 4L11 9"
                stroke="#C9A96E"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-stone hidden sm:block">
            DriveEase
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 flex-1">
          {links.map((l) => {
            if (l.auth && !isAuthenticated) return null;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'text-[13px] tracking-wide transition-colors',
                  pathname === l.to
                    ? 'text-stone'
                    : 'text-stone/40 hover:text-stone/75',
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          {isAuthenticated ? (
            <>
              {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                <Link
                  to="/admin"
                  className="text-[11px] tracking-[0.1em] uppercase text-gold/70 hover:text-gold transition-colors mr-2"
                >
                  Admin
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-ink-4 transition-colors"
                >
                  <div className="w-6 h-6 bg-gold/15 flex items-center justify-center text-gold text-[10px] font-medium">
                    {user ? getInitials(user) : 'U'}
                  </div>
                  <span className="text-[13px] text-stone/60">
                    {user?.firstName}
                  </span>
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-full mt-1 w-44 bg-ink-3 border border-hairline shadow-panel z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-3 text-[13px] text-stone/60 hover:text-stone hover:bg-ink-4 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-bookings"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-3 text-[13px] text-stone/60 hover:text-stone hover:bg-ink-4 transition-colors"
                      >
                        My bookings
                      </Link>
                      <div className="border-t border-hairline" />
                      <button
                        onClick={() => {
                          setUserOpen(false);
                          logout.mutate();
                        }}
                        className="block w-full text-left px-4 py-3 text-[13px] text-[#EB5757]/60 hover:text-[#EB5757] hover:bg-ink-4 transition-colors"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[12px] tracking-[0.08em] uppercase text-stone/50 hover:text-stone transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Reserve now
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden ml-auto p-2 text-stone/50 hover:text-stone"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-hairline bg-ink-3 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {links.map((l) => {
                if (l.auth && !isAuthenticated) return null;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-[13px] text-stone/60 hover:text-stone transition-colors"
                  >
                    {l.label}
                  </Link>
                );
              })}
              {!isAuthenticated && (
                <div className="flex gap-3 pt-3 border-t border-hairline mt-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 text-[12px] tracking-wide text-stone/50 border border-hairline hover:border-subtle hover:text-stone transition-all"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 text-[12px] tracking-wide bg-gold text-ink font-medium hover:bg-gold-light transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
