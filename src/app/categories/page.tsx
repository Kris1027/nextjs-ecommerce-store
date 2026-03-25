import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { categoriesControllerFindAll } from '@/api/generated/sdk.gen';
import type { CategoryResponseDto } from '@/api/generated/types.gen';
import { Card, CardContent } from '@/components/ui/card';
import '@/api/client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all product categories.',
};

const CategoriesPage = async () => {
  const response = await categoriesControllerFindAll({
    query: { limit: '100' },
  }).catch(() => null);

  const categories: CategoryResponseDto[] = response?.data?.data ?? [];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Categories</h1>
        <p className='text-sm text-muted-foreground'>
          Browse all product categories
        </p>
      </div>

      {categories.length === 0 ? (
        <p className='text-center text-sm text-muted-foreground'>
          No categories found.
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className='group overflow-hidden'>
                <div className='relative aspect-video overflow-hidden bg-muted'>
                  {typeof category.imageUrl === 'string' ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center text-muted-foreground'>
                      No image
                    </div>
                  )}
                </div>
                <CardContent className='p-4'>
                  <h2 className='font-semibold'>{category.name}</h2>
                  {typeof category.description === 'string' && (
                    <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                      {category.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
