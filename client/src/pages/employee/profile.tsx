import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserCircle2Icon } from "lucide-react"

export function ProfilePage() {
    const { user } = useAuth()

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">My Profile</h1>
                <p className="mt-2 text-sm text-muted-foreground">Review your account details and role-based preferences.</p>
            </div>
            <Card className="rounded-3xl border-border shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <UserCircle2Icon className="size-5 text-primary" />
                        <div>
                            <CardTitle>{user?.fullname}</CardTitle>
                            <CardDescription>{user?.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-medium">{user?.role}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">IT</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">0645637378</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">Casablanca</p>
                    </div>
               
                </CardContent>
            </Card>
        </div>
    )
}
