'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  usersControllerGetAddressesOptions,
  usersControllerGetAddressesQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';
import {
  usersControllerDeleteAddress,
  usersControllerUpdateAddress,
} from '@/api/generated/sdk.gen';
import type { UserAddressDto } from '@/api/generated/types.gen';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/lib/api-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddressCard } from '@/components/account/address-card';
import { AddressFormDialog } from '@/components/account/address-form-dialog';

const AddressList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    UserAddressDto | undefined
  >();
  const [deletingAddress, setDeletingAddress] = useState<
    UserAddressDto | undefined
  >();

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/account/addresses');
    }
  }, [isHydrated, accessToken, router]);

  const { data, isLoading, isError } = useQuery({
    ...usersControllerGetAddressesOptions(),
    enabled: !!accessToken,
  });

  const deleteAddress = useMutation({
    mutationFn: (id: string) =>
      usersControllerDeleteAddress({
        path: { id },
        throwOnError: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersControllerGetAddressesQueryKey(),
      });
      toast.success('Address deleted.');
      setDeletingAddress(undefined);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const setDefault = useMutation({
    mutationFn: (id: string) =>
      usersControllerUpdateAddress({
        path: { id },
        body: { isDefault: true },
        throwOnError: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersControllerGetAddressesQueryKey(),
      });
      toast.success('Default address updated.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleEdit = (address: UserAddressDto) => {
    setEditingAddress(address);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(undefined);
    setFormOpen(true);
  };

  if (!isHydrated) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  if (!accessToken) return null;

  const addresses = data?.data;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Addresses</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <PlusIcon size={16} />
          Add address
        </Button>
      </div>

      {isLoading && (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className='space-y-3 p-4'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-48' />
              <Skeleton className='h-4 w-40' />
            </Card>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <Card className='p-8 text-center'>
          <p className='text-destructive'>
            Failed to load addresses. Please try again later.
          </p>
        </Card>
      )}

      {!isLoading && !isError && addresses && addresses.length === 0 && (
        <Card className='p-8 text-center'>
          <p className='text-muted-foreground'>
            No addresses yet. Add your first address to get started.
          </p>
        </Card>
      )}

      {!isLoading && !isError && addresses && addresses.length > 0 && (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={setDeletingAddress}
              onSetDefault={(a) => {
                if (!setDefault.isPending) {
                  setDefault.mutate(a.id);
                }
              }}
            />
          ))}
        </div>
      )}

      <AddressFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        address={editingAddress}
      />

      <Dialog
        open={!!deletingAddress}
        onOpenChange={(open) => {
          if (!open) setDeletingAddress(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeletingAddress(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              disabled={deleteAddress.isPending}
              onClick={() => {
                if (deletingAddress) {
                  deleteAddress.mutate(deletingAddress.id);
                }
              }}
            >
              {deleteAddress.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AddressList };
