import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  categoriesControllerFindBySlug,
  categoriesControllerFindAllTree,
  productsControllerFindAll,
} from '@/api/generated/sdk.gen';
import type {
  ProductListItemDto,
  PaginationMeta,
} from '@/api/generated/types.gen';
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  buildBreadcrumbItems,
  type CategoryWithChildren,
} from '@/components/ui/breadcrumb';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductSort } from '@/components/products/product-sort';
import { ProductPagination } from '@/components/products/product-pagination';
import { MobileFilters } from '@/components/products/mobile-filters';
import {
  JsonLd,
  buildCategoryJsonLd,
  buildBreadcrumbJsonLd,
} from '@/components/seo/json-ld';
import { env } from '@/config/env';
import {
  categorySearchParamsSchema,
  CATEGORY_DEFAULTS,
} from '@/schemas/search-params.schema';
import '@/api/client';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
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
    return { title: 'Category Not Found' };
  }

  const description =
    typeof category.description === 'string'
      ? category.description
      : `Browse ${category.name} products.`;

  return {
    title: category.name,
    description,
    openGraph: {
      title: category.name,
      description,
    },
    twitter: {
      title: category.name,
      description,
    },
  };
};

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug } = await params;
  const raw = await searchParams;
  const parsed = categorySearchParamsSchema.safeParse(raw);
  const search = parsed.success ? parsed.data : CATEGORY_DEFAULTS;

  const categoryResponse = await categoriesControllerFindBySlug({
    path: { slug },
  }).catch(() => null);

  const category = categoryResponse?.data?.data;

  if (!category) {
    notFound();
  }

  const treeResponse = await categoriesControllerFindAllTree().catch(
    () => null,
  );
  const treeData = treeResponse?.data?.data as unknown;
  const tree: CategoryWithChildren[] = Array.isArray(treeData) ? treeData : [];

  const findInTree = (
    categories: CategoryWithChildren[],
    id: string,
  ): CategoryWithChildren | null => {
    for (const cat of categories) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findInTree(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const treeNode = findInTree(tree, category.id);
  const subcategories = treeNode?.children ?? [];

  const breadcrumbItems = buildBreadcrumbItems({
    tree,
    categoryId: category.id,
  });

  const productsResponse = await productsControllerFindAll({
    query: {
      page: search.page,
      limit: PRODUCTS_PER_PAGE,
      categoryId: category.id,
      minPrice: search.minPrice,
      maxPrice: search.maxPrice,
      isFeatured: search.isFeatured,
      sortBy: search.sortBy,
      sortOrder: search.sortOrder,
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

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');

  const description =
    typeof category.description === 'string'
      ? category.description
      : `Browse ${category.name} products.`;

  return (
    <div className='space-y-6'>
      <JsonLd
        data={buildCategoryJsonLd({
          name: category.name,
          description,
          slug: category.slug,
          siteUrl,
          imageUrl:
            typeof category.imageUrl === 'string'
              ? category.imageUrl
              : undefined,
          products: products.map((p) => ({
            name: p.name,
            slug: p.slug,
            price: p.price,
            imageUrl: p.images[0]?.url,
          })),
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <Breadcrumb items={breadcrumbItems} />

      <div>
        <h1 className='text-2xl font-bold'>{category.name}</h1>
        {typeof category.description === 'string' && (
          <p className='mt-1 text-sm text-muted-foreground'>
            {category.description}
          </p>
        )}
        {meta.total > 0 && (
          <p className='mt-1 text-sm text-muted-foreground'>
            {meta.total} {meta.total === 1 ? 'product' : 'products'} found
          </p>
        )}
      </div>

      {subcategories.length > 0 && (
        <section className='space-y-4'>
          <h2 className='text-lg font-semibold'>Subcategories</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
            {subcategories.map((sub) => (
              <Link key={sub.id} href={`/categories/${sub.slug}`}>
                <Card className='group overflow-hidden'>
                  <div className='relative aspect-video overflow-hidden bg-muted'>
                    {typeof sub.imageUrl === 'string' ? (
                      <Image
                        src={sub.imageUrl}
                        alt={sub.name}
                        fill
                        sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center text-muted-foreground'>
                        No image
                      </div>
                    )}
                  </div>
                  <CardContent className='p-3'>
                    <h3 className='text-sm font-medium'>{sub.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.total > 0 ? (
        <div className='flex flex-col gap-6 lg:flex-row'>
          <aside className='hidden w-full shrink-0 lg:block lg:w-64'>
            <ProductFilters showCategoryFilter={false} />
          </aside>

          <div className='flex-1 space-y-4'>
            <div className='flex items-center justify-between'>
              <MobileFilters showCategoryFilter={false} />
              <ProductSort />
            </div>
            <ProductGrid products={products} />
            <ProductPagination meta={meta} />
          </div>
        </div>
      ) : (
        subcategories.length === 0 && (
          <p className='text-center text-sm text-muted-foreground'>
            No products found in this category.
          </p>
        )
      )}
    </div>
  );
};

export default CategoryPage;
