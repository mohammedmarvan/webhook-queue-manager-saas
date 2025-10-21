import { useState, useCallback } from 'react';

export function useSidebarState() {
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar-open');
    return saved === null ? true : saved === 'true';
  });

  const setAndPersist = useCallback((state: boolean) => {
    localStorage.setItem('sidebar-open', String(state));
    setOpen(state);
  }, []);

  return { open, setOpen: setAndPersist };
}
