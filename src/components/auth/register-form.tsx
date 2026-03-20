'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { authControllerRegister } from '@/api/generated/sdk.gen';
import { usersControllerGetProfile } from '@/api/generated/sdk.gen';
import { getErrorMessage } from '@/lib/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useGuestCartStore } from '@/stores/guest-cart.store';
import { broadcastLogin } from '@/hooks/use-auth-broadcast';
import { CART_QUERY_KEY } from '@/hooks/use-cart';
import { getSafeRedirect } from '@/lib/safe-redirect';
import { registerSchema } from '@/schemas/auth.schemas';
import type { RegisterFormValues } from '@/schemas/auth.schemas';

export const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const redirect = getSafeRedirect(searchParams.get('redirect'));
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearGuestCart = useGuestCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const { data: tokenResponse } = await authControllerRegister({
        body: {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        },
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
      broadcastLogin();
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
      toast.success('Account created successfully!');
      router.push(redirect);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='firstName' className='text-sm font-medium'>
            First Name
          </label>
          <input
            id='firstName'
            type='text'
            autoComplete='given-name'
            className='border-input bg-background placeholder:text-muted-foreground rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
            placeholder='John'
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className='text-destructive text-xs'>
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='lastName' className='text-sm font-medium'>
            Last Name
          </label>
          <input
            id='lastName'
            type='text'
            autoComplete='family-name'
            className='border-input bg-background placeholder:text-muted-foreground rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
            placeholder='Doe'
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className='text-destructive text-xs'>
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

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
        <label htmlFor='password' className='text-sm font-medium'>
          Password
        </label>
        <input
          id='password'
          type='password'
          autoComplete='new-password'
          className='border-input bg-background placeholder:text-muted-foreground rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
          placeholder='••••••••'
          {...register('password')}
        />
        {errors.password && (
          <p className='text-destructive text-xs'>{errors.password.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1.5'>
        <label htmlFor='confirmPassword' className='text-sm font-medium'>
          Confirm Password
        </label>
        <input
          id='confirmPassword'
          type='password'
          autoComplete='new-password'
          className='border-input bg-background placeholder:text-muted-foreground rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
          placeholder='••••••••'
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className='text-destructive text-xs'>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={registerMutation.isPending}
        className='bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50'
      >
        {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
      </button>

      <p className='text-muted-foreground text-center text-sm'>
        Already have an account?{' '}
        <Link href='/login' className='text-primary hover:underline'>
          Sign in
        </Link>
      </p>
    </form>
  );
};
