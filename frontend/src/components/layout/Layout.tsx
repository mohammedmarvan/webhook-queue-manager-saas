import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/Sidebar';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { Toaster } from '@/components/ui/sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
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
