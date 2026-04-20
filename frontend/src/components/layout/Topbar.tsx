// FILE: frontend/src/components/layout/Topbar.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, ChevronDown, Home, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useUIStore } from '@/store/uiStore';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const Topbar = () => {
  const { user } = useAuthStore();
  const logout = useLogout();
  const { data: unread = 0 } = useUnreadCount();
  const { setNotificationsPanelOpen, theme, toggleTheme } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-14 bg-ink-3 border-b border-hairline flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            className="w-full bg-ink-4 border border-hairline pl-9 pr-4 py-2 text-[13px] text-stone placeholder-stone-5 focus:outline-none focus:border-subtle transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <Link
          to="/"
          className="p-2 text-stone-5 hover:text-stone transition-colors"
          title="Customer view"
        >
          <Home className="w-4 h-4" />
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 text-stone/40 hover:text-stone transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() => setNotificationsPanelOpen(true)}
          className="relative p-2 text-stone-5 hover:text-stone transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-gold text-ink text-[9px] font-medium flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        <div className="relative ml-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-ink-4 transition-colors"
          >
            <div className="w-6 h-6 bg-gold/15 flex items-center justify-center text-gold text-[10px] font-medium">
              {user ? getInitials(user) : 'U'}
            </div>
            <span className="text-[13px] text-stone/60">{user?.firstName}</span>
            <ChevronDown
              className={cn(
                'w-3 h-3 text-stone-5 transition-transform',
                menuOpen && 'rotate-180',
              )}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-1 w-44 bg-ink-3 border border-hairline shadow-panel z-50"
              >
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-[13px] text-stone/60 hover:text-stone hover:bg-ink-4 transition-colors"
                >
                  My profile
                </Link>
                <div className="border-t border-hairline" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
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
      </div>
    </header>
  );
};
