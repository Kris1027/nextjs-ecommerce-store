'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersControllerCreateAddress } from '@/api/generated';
import {
  addressSchema,
  type AddressFormValues,
} from '@/schemas/checkout.schemas';
import { getErrorMessage } from '@/lib/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AddressFormProps = {
  onSuccessAction: (addressId: string) => void;
  onCancelAction: () => void;
};

export const AddressForm = ({
  onSuccessAction,
  onCancelAction,
}: AddressFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'SHIPPING',
      isDefault: false,
      country: 'PL',
    },
  });

  const createAddress = useMutation({
    mutationFn: (data: AddressFormValues) =>
      usersControllerCreateAddress({ body: data, throwOnError: true }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully');
      onSuccessAction(response.data.data.id);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data: AddressFormValues) => {
    createAddress.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='fullName'>Full name</Label>
          <Input id='fullName' {...register('fullName')} />
          {errors.fullName && (
            <p className='text-sm text-red-500'>{errors.fullName.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone'>Phone</Label>
          <Input id='phone' type='tel' {...register('phone')} />
          {errors.phone && (
            <p className='text-sm text-red-500'>{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='street'>Street address</Label>
        <Input id='street' {...register('street')} />
        {errors.street && (
          <p className='text-sm text-red-500'>{errors.street.message}</p>
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label htmlFor='city'>City</Label>
          <Input id='city' {...register('city')} />
          {errors.city && (
            <p className='text-sm text-red-500'>{errors.city.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='region'>Region</Label>
          <Input id='region' {...register('region')} />
          {errors.region && (
            <p className='text-sm text-red-500'>{errors.region.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='postalCode'>Postal code</Label>
          <Input id='postalCode' {...register('postalCode')} />
          {errors.postalCode && (
            <p className='text-sm text-red-500'>{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <input
          id='isDefault'
          type='checkbox'
          {...register('isDefault')}
          className='size-4 rounded border-gray-300'
        />
        <Label htmlFor='isDefault'>Set as default address</Label>
      </div>

      <div className='flex gap-3'>
        <Button type='submit' disabled={createAddress.isPending}>
          {createAddress.isPending ? 'Saving...' : 'Save address'}
        </Button>
        <Button type='button' variant='outline' onClick={onCancelAction}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
