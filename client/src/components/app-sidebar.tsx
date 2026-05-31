"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  TerminalIcon,
  ClipboardCheckIcon,
  AwardIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react"
import { useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { Role } from "@/types"

const hrNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <TerminalSquareIcon />,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: <BotIcon />,
  },
  {
    title: "formations",
    url: "/formations",
    icon: <BookOpenIcon />,
  },
  {
    title: "Sessions",
    url: "/sessions",
    icon: <CalendarIcon />,
  },
  {
    title: "Inscriptions",
    url: "/inscriptions",
    icon: <ClipboardCheckIcon />,
  },
]

const employeeNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <TerminalSquareIcon />,
  },
  {
    title: "My Trainings",
    url: "/my-trainings",
    icon: <BookOpenIcon />,
  },
  {
    title: "My Sessions",
    url: "/my-sessions",
    icon: <CalendarIcon />,
  },
  {
    title: "My Certificates",
    url: "/my-certificates",
    icon: <AwardIcon />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <UserIcon />,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { user } = useAuth()

  const userData = {
    name: user?.fullname || "User",
    email: user?.email || "",
    avatar: "/avatars/shadcn.jpg",
  }

  const filteredNavMain = user?.role === Role.EMPLOYEE ? employeeNav : hrNav

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Enterprise HR</span>
                  <span className="truncate text-xs">Training System</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} currentPath={location.pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
