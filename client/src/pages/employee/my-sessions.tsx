import { useAuth } from "@/hooks/use-auth"
import type { Inscription } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { inscriptionService } from "@/services/inscriptionService"
import { CalendarDaysIcon } from "lucide-react"

export function MySessionsPage() {
    const { user } = useAuth()
    const employeeId = user?.employeeId ?? user?.id
    const { data: inscriptions = [], isLoading } = useQuery<Inscription[], Error>({
        queryKey: ["employeeInscriptions", employeeId],
        queryFn: () => inscriptionService.getByEmployee(employeeId ?? 0),
        enabled: !!employeeId,
    })

    const sessions = inscriptions
        .filter((inscription) => new Date(inscription.session.dateDebut) > new Date())
        .sort((a, b) => new Date(a.session.dateDebut).getTime() - new Date(b.session.dateDebut).getTime())

    if (isLoading) {
        return <div className="p-8">Loading your sessions...</div>
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">My Sessions</h1>
                <p className="mt-2 text-sm text-muted-foreground">Upcoming sessions and session details in one place.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sessions.length ? (
                    sessions.map((inscription) => (
                        <Card key={inscription.id} className="rounded-3xl border-border shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <CalendarDaysIcon className="size-5 text-primary" />
                                    <CardTitle>{inscription.session.formation.titre}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Trainer: {inscription.session.formateur}</p>
                                <p className="text-sm text-muted-foreground">Room: Training Room 3</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(inscription.session.dateDebut).toLocaleDateString()} - {new Date(inscription.session.dateFin).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>No upcoming sessions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">You are not registered for any future session.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
