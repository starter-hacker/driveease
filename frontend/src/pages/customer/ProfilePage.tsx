// FILE: frontend/src/pages/customer/ProfilePage.tsx

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Camera, User, Lock, Award } from 'lucide-react';
import { NavBar } from '@/components/shared/NavBar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfile, useChangePassword } from '@/hooks/useAuth';
import { getInitials, getLoyaltyTierBadge } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  driverLicense: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

const loyaltyProgress: Record<
  string,
  { current: number; next: string; target: number }
> = {
  BRONZE: { current: 0, next: 'Silver', target: 80000 },
  SILVER: { current: 80000, next: 'Gold', target: 200000 },
  GOLD: { current: 200000, next: 'Platinum', target: 500000 },
  PLATINUM: { current: 500000, next: 'Max tier', target: 500000 },
};

const ProfilePage = () => {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'loyalty'
  >('profile');

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      driverLicense: user?.driverLicense || '',
    },
  });

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = (data: ProfileData) => updateProfile.mutate(data);
  const onPasswordSubmit = (data: PasswordData) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => resetPwd() },
    );
  };

  if (!user) return null;

  const tier = user.loyaltyTier;
  const tierInfo = loyaltyProgress[tier];

  return (
    <div className="min-h-screen bg-navy-900">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile header */}
          <div className="glass-card rounded-2xl p-6 mb-6 flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue text-xl font-bold">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  getInitials(user)
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-white/50 text-sm">{user.email}</p>
              <Badge
                className={cn(
                  'mt-1.5 border',
                  getLoyaltyTierBadge(user.loyaltyTier),
                )}
              >
                {user.loyaltyTier} Member
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 glass-card rounded-xl p-1 border border-white/5 mb-6">
            {(['profile', 'security', 'loyalty'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all',
                  activeTab === tab
                    ? 'bg-brand-blue text-white'
                    : 'text-white/50 hover:text-white',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleProfile(onProfileSubmit)}
              className="glass-card rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-brand-blue" />
                <h3 className="font-semibold text-white">
                  Personal Information
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  error={profileErrors.firstName?.message}
                  {...regProfile('firstName')}
                />
                <Input
                  label="Last Name"
                  error={profileErrors.lastName?.message}
                  {...regProfile('lastName')}
                />
              </div>
              <Input
                label="Email"
                value={user.email}
                readOnly
                hint="Email cannot be changed"
              />
              <Input label="Phone Number" {...regProfile('phone')} />
              <Input
                label="Driver's License"
                placeholder="e.g. NGA-2019-DL-4521"
                {...regProfile('driverLicense')}
              />
              <Button type="submit" loading={updateProfile.isPending}>
                Save Changes
              </Button>
            </motion.form>
          )}

          {/* Security tab */}
          {activeTab === 'security' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handlePwd(onPasswordSubmit)}
              className="glass-card rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-brand-blue" />
                <h3 className="font-semibold text-white">Change Password</h3>
              </div>
              <Input
                label="Current Password"
                type="password"
                error={pwdErrors.currentPassword?.message}
                {...regPwd('currentPassword')}
              />
              <Input
                label="New Password"
                type="password"
                error={pwdErrors.newPassword?.message}
                {...regPwd('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                error={pwdErrors.confirmPassword?.message}
                {...regPwd('confirmPassword')}
              />
              <Button type="submit" loading={changePassword.isPending}>
                Update Password
              </Button>
            </motion.form>
          )}

          {/* Loyalty tab */}
          {activeTab === 'loyalty' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <Award className="w-5 h-5 text-brand-blue" />
                <h3 className="font-semibold text-white">Loyalty Program</h3>
              </div>
              <div
                className={cn(
                  'rounded-xl p-5 mb-5 border',
                  getLoyaltyTierBadge(tier),
                )}
              >
                <p className="text-2xl font-bold mb-1">{tier} TIER</p>
                {tier !== 'PLATINUM' && (
                  <p className="text-sm opacity-70">
                    Spend to reach {tierInfo.next} tier
                  </p>
                )}
              </div>
              {tier !== 'PLATINUM' && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">
                      Progress to {tierInfo.next}
                    </span>
                    <span className="text-white/70">
                      {Math.round((tierInfo.current / tierInfo.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-brand-blue h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (tierInfo.current / tierInfo.target) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-5 space-y-2 text-sm">
                {[
                  { tier: 'BRONZE', benefit: 'Standard rates, basic support' },
                  { tier: 'SILVER', benefit: '5% discount on all bookings' },
                  { tier: 'GOLD', benefit: '10% discount + priority support' },
                  {
                    tier: 'PLATINUM',
                    benefit: '15% discount + free insurance',
                  },
                ].map((b) => (
                  <div
                    key={b.tier}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl',
                      b.tier === tier ? 'bg-white/10' : 'opacity-40',
                    )}
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        b.tier === tier ? 'bg-brand-blue' : 'bg-white/20',
                      )}
                    />
                    <span className="font-medium">{b.tier}</span>
                    <span className="text-white/50 ml-auto text-xs">
                      {b.benefit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
