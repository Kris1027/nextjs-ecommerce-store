import type { Metadata } from 'next';
import { productsControllerFindAll } from '@/api/generated/sdk.gen';
import type {
  ProductListItemDto,
  PaginationMeta,
} from '@/api/generated/types.gen';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductSort } from '@/components/products/product-sort';
import { ProductPagination } from '@/components/products/product-pagination';
import {
  searchPageParamsSchema,
  SEARCH_DEFAULTS,
} from '@/schemas/search-params.schema';
import '@/api/client';

type SearchPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export const generateMetadata = async ({
  searchParams,
}: SearchPageProps): Promise<Metadata> => {
  const raw = await searchParams;
  const parsed = searchPageParamsSchema.safeParse(raw);
  const params = parsed.success ? parsed.data : SEARCH_DEFAULTS;

  return {
    title: params.q ? `Search results for "${params.q}"` : 'Search',
    robots: { index: false },
  };
};

const PRODUCTS_PER_PAGE = 12;

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const raw = await searchParams;
  const parsed = searchPageParamsSchema.safeParse(raw);
  const params = parsed.success ? parsed.data : SEARCH_DEFAULTS;
  const query = params.q ?? '';

  const response = query
    ? await productsControllerFindAll({
        query: {
          search: query,
          page: params.page,
          limit: PRODUCTS_PER_PAGE,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
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
