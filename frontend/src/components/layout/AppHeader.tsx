import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center border-b gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Press Ctrl + K to search..."
          className="flex-1"
        />
      </div>
      {/* You can add user avatar, settings, etc. on the right later */}
    </header>
  )
}
