// FILE: frontend/src/pages/auth/LoginPage.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => login.mutate(data);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DriveEase account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          label="Password"
          type="password"
          placeholder="Enter your password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          required
          {...register('password')}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={login.isPending}
        >
          Sign In
        </Button>

        <p className="text-center text-sm text-white/50">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand-blue hover:text-brand-blue-light font-medium"
          >
            Create one free
          </Link>
        </p>
      </form>

      <div className="mt-6 p-4 rounded-xl bg-white/3 border border-white/5">
        <p className="text-xs text-white/40 text-center mb-2 font-medium">
          Demo credentials
        </p>
        <div className="space-y-1 text-xs text-white/50 text-center">
          <p>Admin: admin@driveease.ng / Admin1234!</p>
          <p>Customer: customer@driveease.ng / Customer1234!</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
