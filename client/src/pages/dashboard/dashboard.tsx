import { useAuth } from "@/hooks/use-auth"
import { HRDashboard } from "@/pages/hr/hr-dashboard"
import { UserDashboard } from "./user-dashboard"
import { Role } from "@/types"

export default function DashboardPage() {
    const { user } = useAuth()

    return (
        <>
            {user?.role === Role.HR ? <HRDashboard /> : <UserDashboard />}
        </>
    )
}
