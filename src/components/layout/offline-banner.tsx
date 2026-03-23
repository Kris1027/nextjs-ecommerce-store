'use client';

import { useSyncExternalStore } from 'react';
import { WifiSlashIcon } from '@phosphor-icons/react';

const subscribe = (callback: () => void) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};

const getSnapshot = () => navigator.onLine;

const getServerSnapshot = () => true;

const OfflineBanner = () => {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (isOnline) return null;

  return (
    <div
      role='alert'
      className='fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground'
    >
      <WifiSlashIcon size={16} />
      You are offline. Some features may be unavailable.
    </div>
  );
};

export { OfflineBanner };
