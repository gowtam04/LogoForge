'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * Custom hook for reading sessionStorage using useSyncExternalStore
 * Provides SSR-safe access to sessionStorage with automatic updates
 */
export function useSessionStorage<T>(key: string): T | null {
  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    []
  );

  const getSnapshot = useCallback(() => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    if (!rawValue) return null;
    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return null;
    }
  }, [rawValue]);
}
