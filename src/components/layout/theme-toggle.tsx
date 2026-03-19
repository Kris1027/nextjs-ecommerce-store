'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const emptySubscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

const ThemeToggle = () => {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' disabled aria-label='Toggle theme' />
    );
  }

  const handleToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={handleToggle}
      aria-label='Toggle theme'
    >
      {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
};

export { ThemeToggle };
