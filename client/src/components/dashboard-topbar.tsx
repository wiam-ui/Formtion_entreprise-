import { BellIcon, MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"


export function DashboardTopbar() {
    const { theme, setTheme } = useTheme()
    const nextTheme = theme === "dark" ? "light" : "dark"

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="border-border">
                        <BellIcon className="size-4" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-72">
                    <DropdownMenuItem onClick={() => setTheme(nextTheme)}>
                        {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                        Switch to {nextTheme} mode
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" onClick={() => setTheme(nextTheme)}>
                {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                <span className="sr-only">Switch theme</span>
            </Button>
        </div>
    )
}
