import Link from 'next/link';
import type { CategoryResponseDto } from '@/api/generated/types.gen';

type CategoryWithChildren = CategoryResponseDto & {
  children?: CategoryWithChildren[];
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

const buildCategoryPath = (
  tree: CategoryWithChildren[],
  targetId: string,
  path: CategoryWithChildren[] = [],
): CategoryWithChildren[] | null => {
  for (const cat of tree) {
    const currentPath = [...path, cat];
    if (cat.id === targetId) return currentPath;
    if (cat.children) {
      const found = buildCategoryPath(cat.children, targetId, currentPath);
      if (found) return found;
    }
  }
  return null;
};

const buildBreadcrumbItems = ({
  tree,
  categoryId,
  productName,
}: {
  tree: CategoryWithChildren[];
  categoryId: string;
  productName?: string;
}): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  const categoryPath = buildCategoryPath(tree, categoryId);

  if (categoryPath) {
    categoryPath.forEach((cat, index) => {
      const isLast = index === categoryPath.length - 1 && !productName;
      items.push({
        label: cat.name,
        href: isLast ? undefined : `/categories/${cat.slug}`,
      });
    });
  }

  if (productName) {
    items.push({ label: productName });
  }

  return items;
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav aria-label='Breadcrumb' className='text-sm text-muted-foreground'>
      <ol className='flex items-center gap-1'>
        {items.map((item, index) => (
          <li key={item.href ?? item.label} className='flex items-center gap-1'>
            {index > 0 && <span aria-hidden='true'>/</span>}
            {item.href ? (
              <Link href={item.href} className='hover:text-foreground'>
                {item.label}
              </Link>
            ) : (
              <span className='text-foreground' aria-current='page'>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export { Breadcrumb, buildBreadcrumbItems };
export type { CategoryWithChildren };
