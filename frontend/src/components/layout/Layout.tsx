import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/Sidebar';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';
import { useSidebarState } from '@/hooks/useSidebarState';

export default function Layout() {
  const { open, setOpen } = useSidebarState();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />

        <main className="flex-1 p-4">
          <Outlet />
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
