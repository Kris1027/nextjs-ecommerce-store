import type { Metadata } from 'next';
import { productsControllerFindAll } from '@/api/generated/sdk.gen';
import type {
  ProductListItemDto,
  PaginationMeta,
} from '@/api/generated/types.gen';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductSort } from '@/components/products/product-sort';
import { ProductPagination } from '@/components/products/product-pagination';
import '@/api/client';

export const generateMetadata = async ({
  searchParams,
}: SearchPageProps): Promise<Metadata> => {
  const params = await searchParams;
  const query = params.q;

  return {
    title: query ? `Search results for "${query}"` : 'Search',
    robots: { index: false },
  };
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
};

const PRODUCTS_PER_PAGE = 12;

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const query = params.q ?? '';

  const response = query
    ? await productsControllerFindAll({
        query: {
          search: query,
          page: Number(params.page) || 1,
          limit: PRODUCTS_PER_PAGE,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
        },
      }).catch(() => null)
    : null;

  const products: ProductListItemDto[] = response?.data?.data ?? [];

  const meta: PaginationMeta = response?.data?.meta ?? {
    total: 0,
    page: 1,
    limit: PRODUCTS_PER_PAGE,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className='text-sm text-muted-foreground'>
            {meta.total} {meta.total === 1 ? 'product' : 'products'} found
          </p>
        )}
      </div>

      {query ? (
        <div className='space-y-4'>
          <ProductSort />
          <ProductGrid products={products} />
          <ProductPagination meta={meta} />
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>
          Enter a search term to find products.
        </p>
      )}
    </div>
  );
};

export default SearchPage;
