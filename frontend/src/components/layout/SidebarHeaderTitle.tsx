import { SidebarHeader } from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { Webhook } from 'lucide-react';
import { TypographyH4 } from '../ui/typography';

export function SidebarHeaderTitle() {
  const { state } = useSidebar(); // "expanded" | "collapsed"

  return (
    <SidebarHeader className="px-2 py-3">
      {state === 'collapsed' ? (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Webhook className="h-5 w-5" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Webhook className="h-5 w-5" />
          </div>
          <TypographyH4 className="text-base font-semibold tracking-tight">
            Webhook Queue Manager
          </TypographyH4>
        </div>
      )}
    </SidebarHeader>
  );
}
