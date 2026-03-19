'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';

const DEBOUNCE_MS = 400;

const SearchInput = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!query.trim()) return;

    timerRef.current = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className='relative hidden w-full max-w-sm md:block'>
      <MagnifyingGlass
        size={16}
        className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground'
      />
      <Input
        type='search'
        placeholder='Search products...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className='pl-8'
      />
    </div>
  );
};

export { SearchInput };
