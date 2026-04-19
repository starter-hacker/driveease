// FILE: frontend/src/pages/admin/SettingsPage.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Bell, Palette, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfile } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
] as const;

type TabId = (typeof tabs)[number]['id'];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>('company');
  const { theme, setTheme } = useUIStore();
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const [notifications, setNotifications] = useState({
    newBooking: true,
    bookingCancelled: true,
    paymentReceived: true,
    lowFleet: false,
    weeklyReport: true,
  });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preference saved');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-header">Settings</h1>
        <p className="page-subheader">
          Manage your account and system preferences
        </p>
      </div>

      <div className="flex gap-1 glass-card rounded-xl p-1 border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center',
              activeTab === tab.id
                ? 'bg-brand-blue text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5',
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Company tab */}
        {activeTab === 'company' && (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-blue" /> Company
              Information
            </h3>
            <Input
              label="Company Name"
              defaultValue="DriveEase Nigeria Limited"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-white/50 uppercase mb-1.5 block">
                  Currency
                </label>
                <select className="input-dark text-sm">
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-white/50 uppercase mb-1.5 block">
                  Timezone
                </label>
                <select className="input-dark text-sm">
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
            <Input
              label="Support Email"
              defaultValue="support@driveease.ng"
              type="email"
            />
            <Input label="Support Phone" defaultValue="+234 800 DRIVE 00" />
            <Button onClick={() => toast.success('Company settings saved!')}>
              Save Changes
            </Button>
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSubmit((data) => updateProfile.mutate(data))}
            className="glass-card rounded-2xl p-6 space-y-4"
          >
            <h3 className="font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-brand-blue" /> My Profile
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" {...register('firstName')} />
              <Input label="Last Name" {...register('lastName')} />
            </div>
            <Input
              label="Email"
              value={user?.email || ''}
              readOnly
              hint="Email cannot be changed"
            />
            <Input label="Phone" {...register('phone')} />
            <Button type="submit" loading={updateProfile.isPending}>
              Save Profile
            </Button>
          </form>
        )}

        {/* Notifications tab */}
        {activeTab === 'notifications' && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-blue" /> Notification
              Preferences
            </h3>
            {[
              {
                key: 'newBooking' as const,
                label: 'New Booking',
                desc: 'When a customer creates a new booking',
              },
              {
                key: 'bookingCancelled' as const,
                label: 'Booking Cancelled',
                desc: 'When a booking is cancelled',
              },
              {
                key: 'paymentReceived' as const,
                label: 'Payment Received',
                desc: 'When a payment is processed',
              },
              {
                key: 'lowFleet' as const,
                label: 'Low Fleet Alert',
                desc: 'When available cars drop below 5',
              },
              {
                key: 'weeklyReport' as const,
                label: 'Weekly Report',
                desc: 'Receive weekly performance summary',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotif(item.key)}
                  className={cn(
                    'w-11 h-6 rounded-full transition-all relative',
                    notifications[item.key] ? 'bg-brand-blue' : 'bg-white/10',
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                      notifications[item.key] ? 'left-6' : 'left-1',
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Appearance tab */}
        {activeTab === 'appearance' && (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-blue" /> Appearance
            </h3>
            <div>
              <p className="text-sm font-medium text-white mb-3">Theme</p>
              <div className="flex gap-3">
                {[
                  { value: 'dark' as const, icon: Moon, label: 'Dark' },
                  { value: 'light' as const, icon: Sun, label: 'Light' },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                      toast.success(`${t.label} mode activated`);
                    }}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 rounded-xl border transition-all',
                      theme === t.value
                        ? 'bg-brand-blue/20 border-brand-blue text-brand-blue'
                        : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white',
                    )}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/3 border border-white/5">
              <p className="text-sm text-white/50">
                DriveEase is optimized for dark mode. Light mode is available
                but some features may look best in dark.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SettingsPage;
