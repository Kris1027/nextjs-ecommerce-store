import type { Metadata } from 'next';
import {
  productsControllerFindAll,
  categoriesControllerFindAll,
} from '@/api/generated/sdk.gen';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { NewArrivals } from '@/components/home/new-arrivals';
import type { ProductListItemDto } from '@/api/generated/types.gen';
import type { CategoryResponseDto } from '@/api/generated/types.gen';
import '@/api/client';

export const metadata: Metadata = {
  title: 'Home | Ecommerce Store',
  description:
    'Discover quality products at great prices. Shop featured items, new arrivals, and browse categories.',
};

const Home = async () => {
  const [featuredResponse, newArrivalsResponse, categoriesResponse] =
    await Promise.all([
      productsControllerFindAll({
        query: { limit: 8, isFeatured: 'true' },
      }).catch(() => null),
      productsControllerFindAll({
        query: { limit: 8, sortBy: 'createdAt', sortOrder: 'desc' },
      }).catch(() => null),
      categoriesControllerFindAll({
        query: { limit: '12' },
      }).catch(() => null),
    ]);

  const featuredProducts: ProductListItemDto[] =
    featuredResponse?.data?.data ?? [];

  const newArrivalProducts: ProductListItemDto[] =
    newArrivalsResponse?.data?.data ?? [];

  const categories: CategoryResponseDto[] =
    categoriesResponse?.data?.data ?? [];

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <CategoryShowcase categories={categories} />
      <NewArrivals products={newArrivalProducts} />
    </>
  );
};

export default Home;
