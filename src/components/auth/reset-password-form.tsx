'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { authControllerResetPassword } from '@/api/generated/sdk.gen';
import { resetPasswordSchema } from '@/schemas/auth.schemas';
import type { ResetPasswordFormValues } from '@/schemas/auth.schemas';

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (values: ResetPasswordFormValues) => {
      if (!token) throw new Error('No reset token provided');

      const { data } = await authControllerResetPassword({
        body: { token, password: values.password },
        throwOnError: true,
      });
      return data;
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Failed to reset password. The link may have expired.',
      );
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetMutation.mutate(values);
  };

  if (!token) {
    return (
      <div className='flex flex-col gap-4 text-center'>
        <p className='text-muted-foreground text-sm'>
          Invalid reset link. Please request a new one.
        </p>
        <Link
          href='/forgot-password'
          className='text-primary hover:underline text-sm'
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (resetMutation.isSuccess) {
    return (
      <div className='flex flex-col gap-4 text-center'>
        <p className='text-sm'>Your password has been reset successfully.</p>
        <Link
          href='/login'
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors'
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1.5'>
        <label htmlFor='password' className='text-sm font-medium'>
          New Password
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
          Confirm New Password
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
        disabled={resetMutation.isPending}
        className='bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50'
      >
        {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};
