'use client';

import type { UserAddressDto } from '@/api/generated/types.gen';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PencilSimpleIcon, TrashIcon, StarIcon } from '@phosphor-icons/react';

type AddressCardProps = {
  address: UserAddressDto;
  onEdit: (address: UserAddressDto) => void;
  onDelete: (address: UserAddressDto) => void;
  onSetDefault: (address: UserAddressDto) => void;
};

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) => {
  const region = address.region as unknown as string | null;

  return (
    <Card className='flex flex-col justify-between gap-4 p-4'>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Badge
            variant={address.type === 'SHIPPING' ? 'default' : 'secondary'}
          >
            {address.type}
          </Badge>
          {address.isDefault && <Badge variant='outline'>Default</Badge>}
        </div>
        <div className='text-sm'>
          <p className='font-medium'>{address.fullName}</p>
          <p className='text-muted-foreground'>{address.street}</p>
          <p className='text-muted-foreground'>
            {address.postalCode} {address.city}
            {region ? `, ${region}` : ''}
          </p>
          <p className='text-muted-foreground'>{address.country}</p>
          <p className='text-muted-foreground'>{address.phone}</p>
        </div>
      </div>

      <div className='flex gap-2'>
        <Button variant='outline' size='sm' onClick={() => onEdit(address)}>
          <PencilSimpleIcon size={14} />
          Edit
        </Button>
        <Button variant='outline' size='sm' onClick={() => onDelete(address)}>
          <TrashIcon size={14} />
          Delete
        </Button>
        {!address.isDefault && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onSetDefault(address)}
          >
            <StarIcon size={14} />
            Set default
          </Button>
        )}
      </div>
    </Card>
  );
};

export { AddressCard };
