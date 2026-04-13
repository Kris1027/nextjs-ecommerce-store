'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  usersControllerCreateAddress,
  usersControllerUpdateAddress,
} from '@/api/generated/sdk.gen';
import { usersControllerGetAddressesQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import type { UserAddressDto } from '@/api/generated/types.gen';
import { getErrorMessage } from '@/lib/api-error';
import {
  addressSchema,
  type AddressFormValues,
} from '@/schemas/checkout.schemas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AddressFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: UserAddressDto;
};

const AddressFormDialog = ({
  open,
  onOpenChange,
  address,
}: AddressFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!address;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'SHIPPING',
      isDefault: false,
      fullName: '',
      phone: '',
      street: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'PL',
    },
  });

  useEffect(() => {
    if (open && address) {
      reset({
        type: address.type,
        isDefault: address.isDefault,
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        region: address.region ?? '',
        postalCode: address.postalCode,
        country: address.country,
      });
    } else if (open) {
      reset({
        type: 'SHIPPING',
        isDefault: false,
        fullName: '',
        phone: '',
        street: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'PL',
      });
    }
  }, [open, address, reset]);

  const createAddress = useMutation({
    mutationFn: (data: AddressFormValues) =>
      usersControllerCreateAddress({ body: data, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersControllerGetAddressesQueryKey(),
      });
      toast.success('Address added successfully.');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateAddress = useMutation({
    mutationFn: (data: AddressFormValues) =>
      usersControllerUpdateAddress({
        path: { id: address!.id },
        body: data,
        throwOnError: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersControllerGetAddressesQueryKey(),
      });
      toast.success('Address updated successfully.');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const isPending = createAddress.isPending || updateAddress.isPending;

  const onSubmit = (data: AddressFormValues) => {
    if (isEditing) {
      updateAddress.mutate(data);
    } else {
      createAddress.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit address' : 'Add new address'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='fullName'>Full name</Label>
              <Input id='fullName' {...register('fullName')} />
              {errors.fullName && (
                <p role='alert' className='text-destructive text-xs'>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone</Label>
              <Input
                id='phone'
                type='tel'
                placeholder='123456789'
                {...register('phone')}
              />
              {errors.phone && (
                <p role='alert' className='text-destructive text-xs'>
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='street'>Street address</Label>
            <Input id='street' {...register('street')} />
            {errors.street && (
              <p role='alert' className='text-destructive text-xs'>
                {errors.street.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div className='space-y-2'>
              <Label htmlFor='city'>City</Label>
              <Input id='city' {...register('city')} />
              {errors.city && (
                <p role='alert' className='text-destructive text-xs'>
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='region'>Region</Label>
              <Input id='region' {...register('region')} />
              {errors.region && (
                <p role='alert' className='text-destructive text-xs'>
                  {errors.region.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='postalCode'>Postal code</Label>
              <Input
                id='postalCode'
                placeholder='XX-XXX'
                {...register('postalCode')}
              />
              {errors.postalCode && (
                <p role='alert' className='text-destructive text-xs'>
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Address type</Label>
            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full' aria-label='Address type'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='SHIPPING'>Shipping</SelectItem>
                    <SelectItem value='BILLING'>Billing</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
            <Button type='submit' disabled={isPending}>
              {isPending
                ? 'Saving...'
                : isEditing
                  ? 'Save changes'
                  : 'Add address'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddressFormDialog };
