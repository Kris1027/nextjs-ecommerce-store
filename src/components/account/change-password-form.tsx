'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersControllerChangePassword } from '@/api/generated/sdk.gen';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/lib/api-error';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/schemas/account.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const ChangePasswordForm = () => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/account/change-password');
    }
  }, [isHydrated, accessToken, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePassword = useMutation({
    mutationFn: (data: ChangePasswordFormValues) =>
      usersControllerChangePassword({ body: data, throwOnError: true }),
    onSuccess: () => {
      toast.success('Password changed successfully.');
      reset();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (!isHydrated) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  if (!accessToken) return null;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Change Password</h1>
        <p className='text-muted-foreground text-sm'>
          Update your password to keep your account secure.
        </p>
      </div>

      <Card className='p-6'>
        <form
          onSubmit={handleSubmit((data) => changePassword.mutate(data))}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='currentPassword'>Current password</Label>
            <Input
              id='currentPassword'
              type='password'
              autoComplete='current-password'
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className='text-destructive text-xs'>
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='newPassword'>New password</Label>
            <Input
              id='newPassword'
              type='password'
              autoComplete='new-password'
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className='text-destructive text-xs'>
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm new password</Label>
            <Input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className='text-destructive text-xs'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type='submit' disabled={changePassword.isPending}>
            {changePassword.isPending ? 'Changing...' : 'Change password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export { ChangePasswordForm };
