'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { authControllerLogin } from '@/api/generated/sdk.gen';
import { usersControllerGetProfile } from '@/api/generated/sdk.gen';
import { useAuthStore } from '@/stores/auth.store';
import { useGuestCartStore } from '@/stores/guest-cart.store';
import { loginSchema } from '@/schemas/auth.schemas';
import type { LoginFormValues } from '@/schemas/auth.schemas';

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const setAuth = useAuthStore((state) => state.setAuth);
  const guestCartToken = useGuestCartStore((state) => state.token);
  const clearGuestCart = useGuestCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data: tokenResponse } = await authControllerLogin({
        body: {
          email: values.email,
          password: values.password,
        },
        headers: guestCartToken
          ? { 'x-guest-cart-token': guestCartToken }
          : undefined,
        throwOnError: true,
      });

      const { data: profileResponse } = await usersControllerGetProfile({
        headers: {
          Authorization: `Bearer ${tokenResponse.data.accessToken}`,
        },
        throwOnError: true,
      });

      return {
        tokens: tokenResponse.data,
        user: profileResponse.data,
      };
    },
    onSuccess: ({ tokens, user }) => {
      setAuth(tokens.accessToken, tokens.refreshToken, user);
      clearGuestCart();
      toast.success('Signed in successfully!');
      router.push(redirect);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid email or password.');
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1.5'>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          className='border-input bg-background placeholder:text-muted-foreground rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
          placeholder='john@example.com'
          {...register('email')}
        />
        {errors.email && (
          <p className='text-destructive text-xs'>{errors.email.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between'>
          <label htmlFor='password' className='text-sm font-medium'>
            Password
          </label>
          <Link
            href='/forgot-password'
            className='text-muted-foreground hover:text-primary text-xs'
          >
            Forgot password?
          </Link>
        </div>
        <input
          id='password'
          type='password'
          autoComplete='current-password'
          className='border-input bg-background placeholder:text-muted-foreground rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
          placeholder='••••••••'
          {...register('password')}
        />
        {errors.password && (
          <p className='text-destructive text-xs'>{errors.password.message}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={loginMutation.isPending}
        className='bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50'
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
      </button>

      <p className='text-muted-foreground text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/register' className='text-primary hover:underline'>
          Create one
        </Link>
      </p>
    </form>
  );
};
