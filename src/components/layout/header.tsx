import { categoriesControllerFindAllTree } from '@/api/generated/sdk.gen';
import { HeaderClient } from '@/components/layout/header-client';
import type { CategoryResponseDto } from '@/api/generated/types.gen';
import '@/api/client';

const Header = async () => {
  let categories: CategoryResponseDto[] = [];

  try {
    const response = await categoriesControllerFindAllTree();

    if (response.data?.success) {
      // API types `data` as singular CategoryResponseDto but it returns an array at runtime
      const data = response.data.data as unknown;
      categories = Array.isArray(data) ? (data as CategoryResponseDto[]) : [];
    }
  } catch {
    // Header still renders with empty categories on API failure
  }

  return <HeaderClient categories={categories} />;
};

export { Header };
