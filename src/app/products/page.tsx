import type { Metadata } from 'next';
import {
  productsControllerFindAll,
  categoriesControllerFindAll,
} from '@/api/generated/sdk.gen';
import type {
  ProductListItemDto,
  CategoryResponseDto,
  PaginationMeta,
} from '@/api/generated/types.gen';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductSort } from '@/components/products/product-sort';
import { ProductPagination } from '@/components/products/product-pagination';
import { MobileFilters } from '@/components/products/mobile-filters';
import '@/api/client';

export const metadata: Metadata = {
  title: 'Products | Ecommerce Store',
  description:
    'Browse our full catalog of products. Filter by category, price, and more.',
};

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    isFeatured?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    search?: string;
  }>;
};

const PRODUCTS_PER_PAGE = 12;

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const params = await searchParams;

  const [productsResponse, categoriesResponse] = await Promise.all([
    productsControllerFindAll({
      query: {
        page: Number(params.page) || 1,
        limit: PRODUCTS_PER_PAGE,
        categoryId: params.category,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        isFeatured: params.isFeatured,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
        search: params.search,
      },
    }).catch(() => null),
    categoriesControllerFindAll({
      query: { limit: '100' },
    }).catch(() => null),
  ]);

  const products: ProductListItemDto[] = productsResponse?.data?.data ?? [];

  const meta: PaginationMeta = productsResponse?.data?.meta ?? {
    total: 0,
    page: 1,
    limit: PRODUCTS_PER_PAGE,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const categories: CategoryResponseDto[] =
    categoriesResponse?.data?.data ?? [];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Products</h1>
        <p className='text-sm text-muted-foreground'>
          {meta.total} {meta.total === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className='flex flex-col gap-6 lg:flex-row'>
        <aside className='hidden w-full shrink-0 lg:block lg:w-64'>
          <ProductFilters categories={categories} />
        </aside>

        <div className='flex-1 space-y-4'>
          <div className='flex items-center justify-between'>
            <MobileFilters categories={categories} />
            <ProductSort />
          </div>
          <ProductGrid products={products} />
          <ProductPagination meta={meta} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
