import { ArrowDownFromLine, Home, FolderDot, ArrowUpFromLine, Settings, RefreshCcw } from "lucide-react"
import { SidebarHeaderTitle } from "./SidebarHeaderTitle"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Project",
    url: "/project",
    icon: FolderDot,
  },
  {
    title: "Sources",
    url: "#",
    icon: ArrowDownFromLine,
  },
  {
    title: "Destinations",
    url: "#",
    icon: ArrowUpFromLine,
  },
  {
    title: "Events",
    url: "#",
    icon: Settings,
  },
  {
    title: "Logs",
    url: "#",
    icon: RefreshCcw,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" >
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
    </Sidebar>
  )
}