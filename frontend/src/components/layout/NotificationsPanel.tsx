// FILE: frontend/src/components/layout/NotificationsPanel.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, CheckCheck } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/useNotifications';
import { formatRelativeTime, getNotificationColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const NotificationsPanel = () => {
  const { notificationsPanelOpen, setNotificationsPanelOpen } = useUIStore();
  const { data } = useNotifications({ limit: 20 });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.data || [];

  return (
    <AnimatePresence>
      {notificationsPanelOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={() => setNotificationsPanelOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="h-full flex flex-col"
              style={{
                background: 'rgba(10, 15, 30, 0.95)',
                backdropFilter: 'blur(30px)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-blue" />
                  <h2 className="text-lg font-semibold text-white">
                    Notifications
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsRead.mutate()}
                    leftIcon={<CheckCheck className="w-4 h-4" />}
                    className="text-xs"
                  >
                    All read
                  </Button>
                  <button
                    onClick={() => setNotificationsPanelOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Bell className="w-12 h-12 text-white/10 mb-3" />
                    <p className="text-white/40 text-sm">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((n) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          'p-4 hover:bg-white/3 transition-colors cursor-pointer group',
                          !n.isRead && 'bg-brand-blue/3',
                        )}
                        onClick={() => !n.isRead && markAsRead.mutate(n.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full mt-2 shrink-0',
                              !n.isRead ? 'bg-brand-blue' : 'bg-transparent',
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/90">
                              {n.title}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                              {n.message}
                            </p>
                            <p
                              className={cn(
                                'text-xs mt-1.5 font-medium',
                                getNotificationColor(n.type),
                              )}
                            >
                              {formatRelativeTime(n.createdAt)}
                            </p>
                          </div>
                          {!n.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead.mutate(n.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
