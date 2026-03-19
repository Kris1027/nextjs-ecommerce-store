'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/api/generated/types.gen';

type ProductPaginationProps = {
  meta: PaginationMeta;
};

const ProductPagination = ({ meta }: ProductPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (meta.totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/products?${params.toString()}`);
  };

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const current = meta.page;
    const total = meta.totalPages;

    pages.push(1);

    if (current > 3) pages.push('...');

    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }

    if (current < total - 2) pages.push('...');

    if (total > 1) pages.push(total);

    return pages;
  };

  return (
    <div className='flex items-center justify-center gap-1'>
      <Button
        variant='outline'
        size='icon'
        disabled={meta.page <= 1}
        onClick={() => handlePageChange(meta.page - 1)}
      >
        <CaretLeftIcon size={16} />
      </Button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className='px-2 text-sm text-muted-foreground'
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === meta.page ? 'default' : 'outline'}
            size='icon'
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant='outline'
        size='icon'
        disabled={!meta.hasNextPage}
        onClick={() => handlePageChange(meta.page + 1)}
      >
        <CaretRightIcon size={16} />
      </Button>
    </div>
  );
};

export { ProductPagination };
