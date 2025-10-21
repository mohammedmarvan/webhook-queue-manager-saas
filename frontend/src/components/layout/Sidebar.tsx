import {
  ArrowDownFromLine,
  Home,
  FolderDot,
  ArrowUpFromLine,
  Settings,
  RefreshCcw,
} from 'lucide-react';
import { SidebarHeaderTitle } from './SidebarHeaderTitle';
import { useAuthUser } from '@/hooks/useAuthUser';
import { NavUser } from './NavUser';
import { memo } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Project',
    url: '/project',
    icon: FolderDot,
  },
  {
    title: 'Sources',
    url: '/source',
    icon: ArrowDownFromLine,
  },
  {
    title: 'Destinations',
    url: '/destination',
    icon: ArrowUpFromLine,
  },
  {
    title: 'Events',
    url: '/event',
    icon: Settings,
  },
  {
    title: 'Logs',
    url: '#',
    icon: RefreshCcw,
  },
];

export const AppSidebar = memo(() => {
  const user = useAuthUser();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // redirect
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderTitle />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} onLogout={handleLogout} />}
      </SidebarFooter>
    </Sidebar>
  );
});
