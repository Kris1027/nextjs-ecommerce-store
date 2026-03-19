'use client';

import { FunnelIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ProductFilters } from '@/components/products/product-filters';
import type { CategoryResponseDto } from '@/api/generated/types.gen';

type MobileFiltersProps = {
  categories?: CategoryResponseDto[];
  showCategoryFilter?: boolean;
};

const MobileFilters = ({
  categories,
  showCategoryFilter = true,
}: MobileFiltersProps) => {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant='outline' size='sm' className='lg:hidden' />}
      >
        <FunnelIcon size={16} data-icon='inline-start' />
        Filters
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className='mt-4'>
          <ProductFilters
            categories={categories}
            showCategoryFilter={showCategoryFilter}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobileFilters };
