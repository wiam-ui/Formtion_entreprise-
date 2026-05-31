import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useLocation } from "react-router-dom"
import { DashboardTopbar } from "@/components/dashboard-topbar"

export function MainLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const pathSegments = location.pathname.split('/').filter(Boolean)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/80 px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {pathSegments.map((segment) => (
                                    <React.Fragment key={segment}>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="capitalize">
                                                {segment}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <DashboardTopbar />
                </header>
                <main className="flex-1 overflow-auto bg-slate-50/50">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

import React from "react"
