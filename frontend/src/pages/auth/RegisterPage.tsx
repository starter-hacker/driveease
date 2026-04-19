// FILE: frontend/src/pages/auth/RegisterPage.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRegister } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const schema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Needs one uppercase letter')
      .regex(/[a-z]/, 'Needs one lowercase letter')
      .regex(/\d/, 'Needs one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const strengthColors = [
  '',
  'bg-brand-rose',
  'bg-brand-amber',
  'bg-yellow-400',
  'bg-brand-emerald',
  'bg-brand-emerald',
];

const RegisterPage = () => {
  const register_user = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch('password', '');
  const strength = getPasswordStrength(password);

  const onSubmit = (data: FormData) => {
    const { confirmPassword, ...rest } = data;
    register_user.mutate(rest);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of customers enjoying premium car rentals"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="Emeka"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.firstName?.message}
            required
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Okafor"
            error={errors.lastName?.message}
            required
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+234 800 000 0000"
          leftIcon={<Phone className="w-4 h-4" />}
          {...register('phone')}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            required
            {...register('password')}
          />
          {password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      i <= strength ? strengthColors[strength] : 'bg-white/10',
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-white/40 mt-1">
                Strength:{' '}
                <span className="font-medium text-white/60">
                  {strengthLabels[strength]}
                </span>
              </p>
            </motion.div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          required
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={register_user.isPending}
        >
          Create Account
        </Button>

        <p className="text-center text-sm text-white/50">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-blue hover:text-brand-blue-light font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
