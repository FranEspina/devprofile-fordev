import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { EVENTS_MENU } from "@/constant";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProfileStore } from "@/store/profileStore"

export function ModeToggle() {

  const { theme, setThemeState } = useProfileStore(state => state)
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (theme === 'not-loaded') return
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
    localStorage.setItem('theme', isDark ? 'dark' : 'ligth')
  }, [theme])

  React.useEffect(() => {
    if (open) {
      window.dispatchEvent(new Event(EVENTS_MENU.CloseMenu));
    }
  }, [open])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild >
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-blue-900" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setThemeState("theme-light")}>
          <span className="px-2 text-xs md:text-base">MODO CLARO</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeState("dark")}>
          <span className="px-2 text-xs md:text-base">MODO OSCURO</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeState("system")}>
          <span className="px-2 text-xs md:text-base">SISTEMA</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}