import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/Sidebar';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { Toaster } from '@/components/ui/sonner';
import { useState, useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open');
    if (saved !== null) setOpen(saved === 'true');
  }, []);

  const sidebarOpenHandler = (state: boolean) => {
    localStorage.setItem('sidebar-open', String(state));
    setOpen(state);
  };

  return (
    <SidebarProvider open={open} onOpenChange={sidebarOpenHandler}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />

        <main className="flex-1 p-4">
          {children}
          <Toaster
            position="top-right"
            closeButton
            richColors
            duration={4000}
          />
        </main>

        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
