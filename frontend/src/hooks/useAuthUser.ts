import { useMemo } from 'react';

export function useAuthUser() {
  const raw = localStorage.getItem('user');
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { name: string; email: string };
    } catch {
      return null;
    }
  }, [raw]);
}
