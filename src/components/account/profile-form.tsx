'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  usersControllerGetProfileOptions,
  usersControllerGetProfileQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';
import { usersControllerUpdateProfile } from '@/api/generated/sdk.gen';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/lib/api-error';
import {
  profileSchema,
  type ProfileFormValues,
} from '@/schemas/account.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/account/profile');
    }
  }, [isHydrated, accessToken, router]);

  const { data, isLoading, isError } = useQuery({
    ...usersControllerGetProfileOptions(),
    enabled: !!accessToken,
  });

  const profile = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset(
        {
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
        },
        { keepDirtyValues: true },
      );
    }
  }, [profile, reset]);

  const updateProfile = useMutation({
    mutationFn: (data: ProfileFormValues) =>
      usersControllerUpdateProfile({ body: data, throwOnError: true }),
    onSuccess: (response) => {
      setUser(response.data.data);
      queryClient.invalidateQueries({
        queryKey: usersControllerGetProfileQueryKey(),
      });
      toast.success('Profile updated successfully.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (!isHydrated) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  if (!accessToken) return null;

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-8 w-48' />
        <Card className='space-y-4 p-6'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className='p-8 text-center'>
        <p className='text-destructive'>
          Failed to load profile. Please try again later.
        </p>
      </Card>
    );
  }

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Profile</h1>
        <p className='text-muted-foreground text-sm'>
          Manage your personal information.
        </p>
      </div>

      <Card className='p-6'>
        <form
          onSubmit={handleSubmit((data) => updateProfile.mutate(data))}
          className='space-y-4'
        >
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First name</Label>
              <Input id='firstName' {...register('firstName')} />
              {errors.firstName && (
                <p role='alert' className='text-destructive text-xs'>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last name</Label>
              <Input id='lastName' {...register('lastName')} />
              {errors.lastName && (
                <p role='alert' className='text-destructive text-xs'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Email</Label>
            <p className='text-muted-foreground text-sm'>{profile?.email}</p>
          </div>

          <div className='space-y-2'>
            <Label>Member since</Label>
            <p className='text-muted-foreground text-sm'>{memberSince}</p>
          </div>

          <Button type='submit' disabled={updateProfile.isPending || !isDirty}>
            {updateProfile.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export { ProfileForm };
