import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  categoriesControllerFindBySlug,
  productsControllerFindAll,
} from '@/api/generated/sdk.gen';
import type {
  ProductListItemDto,
  PaginationMeta,
} from '@/api/generated/types.gen';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductSort } from '@/components/products/product-sort';
import { ProductPagination } from '@/components/products/product-pagination';
import '@/api/client';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
};

const PRODUCTS_PER_PAGE = 12;

export const generateMetadata = async ({
  params,
}: CategoryPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const response = await categoriesControllerFindBySlug({
    path: { slug },
  }).catch(() => null);

  const category = response?.data?.data;

  if (!category) {
    return { title: 'Category Not Found | Ecommerce Store' };
  }

  return {
    title: `${category.name} | Ecommerce Store`,
    description:
      typeof category.description === 'string'
        ? category.description
        : `Browse ${category.name} products.`,
  };
};

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug } = await params;
  const search = await searchParams;

  const categoryResponse = await categoriesControllerFindBySlug({
    path: { slug },
  }).catch(() => null);

  const category = categoryResponse?.data?.data;

  if (!category) {
    notFound();
  }

  const productsResponse = await productsControllerFindAll({
    query: {
      page: Number(search.page) || 1,
      limit: PRODUCTS_PER_PAGE,
      categoryId: category.id,
      sortBy: search.sortBy,
      sortOrder: search.sortOrder as 'asc' | 'desc' | undefined,
    },
  }).catch(() => null);

  const products: ProductListItemDto[] = productsResponse?.data?.data ?? [];

  const meta: PaginationMeta = productsResponse?.data?.meta ?? {
    total: 0,
    page: 1,
    limit: PRODUCTS_PER_PAGE,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div className='space-y-6'>
      <nav className='flex items-center gap-1 text-sm text-muted-foreground'>
        <Link href='/' className='hover:text-foreground'>
          Home
        </Link>
        <span>/</span>
        <span className='text-foreground'>{category.name}</span>
      </nav>

      <div>
        <h1 className='text-2xl font-bold'>{category.name}</h1>
        {typeof category.description === 'string' && (
          <p className='mt-1 text-sm text-muted-foreground'>
            {category.description}
          </p>
        )}
        <p className='mt-1 text-sm text-muted-foreground'>
          {meta.total} {meta.total === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className='space-y-4'>
        <ProductSort />
        <ProductGrid products={products} />
        <ProductPagination meta={meta} />
      </div>
    </div>
  );
};

export default CategoryPage;
