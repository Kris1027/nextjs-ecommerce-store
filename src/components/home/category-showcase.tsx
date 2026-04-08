import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { blurDataUrl } from '@/lib/image';
import type { CategoryResponseDto } from '@/api/generated/types.gen';

type CategoryShowcaseProps = {
  categories: CategoryResponseDto[];
};

const CategoryShowcase = ({ categories }: CategoryShowcaseProps) => {
  if (categories.length === 0) return null;

  return (
    <section className='bg-muted/40 py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-8 text-2xl font-bold tracking-tight'>
          Shop by Category
        </h2>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {categories.map((category) => {
            const imageUrl = category.imageUrl;
            const description = category.description;

            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className='group overflow-hidden transition-shadow hover:shadow-md'>
                  <div className='relative aspect-4/3 overflow-hidden bg-muted'>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                        placeholder='blur'
                        blurDataURL={blurDataUrl(400, 300)}
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center text-muted-foreground'>
                        {category.name}
                      </div>
                    )}
                  </div>
                  <CardContent className='p-3'>
                    <h3 className='font-medium'>{category.name}</h3>
                    {description && (
                      <p className='mt-0.5 line-clamp-1 text-xs text-muted-foreground'>
                        {description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { CategoryShowcase };
