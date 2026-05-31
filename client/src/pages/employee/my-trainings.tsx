import { useAuth } from "@/hooks/use-auth"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { inscriptionService } from "@/services/inscriptionService"
import { List } from "lucide-react"
import type { Inscription } from "@/types"

export function MyTrainingsPage() {
    const { user } = useAuth()
    const employeeId = user?.employeeId ?? user?.id
    const { data: inscriptions = [], isLoading } = useQuery<Inscription[], Error>({
        queryKey: ["employeeInscriptions", employeeId],
        queryFn: () => inscriptionService.getByEmployee(employeeId ?? 0),
        enabled: !!employeeId,
    })

    if (isLoading) {
        return <div className="p-8">Loading your trainings...</div>
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">My Trainings</h1>
                <p className="mt-2 text-sm text-muted-foreground">View personalized training cards and progress states.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {inscriptions.length ? (
                    inscriptions.map((inscription) => (
                        <Card key={inscription.id} className="rounded-3xl border-border shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <List className="size-5 text-primary" />
                                    <div>
                                        <CardTitle>{inscription.session.formation.titre}</CardTitle>
                                        <CardDescription>{inscription.session.formateur}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>Status: {inscription.statutProgression.replace("_", " ")}</p>
                                    <p>Start date: {new Date(inscription.session.dateDebut).toLocaleDateString()}</p>
                                    <p>End date: {new Date(inscription.session.dateFin).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>No trainings assigned yet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">When your manager assigns courses, they will appear here.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
