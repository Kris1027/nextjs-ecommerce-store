import { zodResolver as baseZodResolver } from '@hookform/resolvers/zod';
import type { FieldValues, Resolver } from 'react-hook-form';
import type { z } from 'zod';

// Zod 4.3+ has a minor version mismatch with @hookform/resolvers@5.2.2
// which was built against Zod 4.0.x. The resolver works correctly at runtime
// but the types don't match. This wrapper fixes the type signature.
// Remove this wrapper when @hookform/resolvers ships Zod 4.3+ support.
export const zodResolver = <T extends z.ZodType<FieldValues>>(
  schema: T,
): Resolver<z.infer<T>> =>
  // @ts-expect-error — Zod 4.3 _zod.version.minor (3) !== expected (0)
  baseZodResolver(schema) as Resolver<z.infer<T>>;
