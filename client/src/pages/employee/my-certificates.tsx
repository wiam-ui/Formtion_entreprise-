import { useAuth } from "@/hooks/use-auth"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { inscriptionService } from "@/services/inscriptionService"
import { certificatService } from "@/services/certificatService"
import { AwardIcon, DownloadIcon } from "lucide-react"
import type { Inscription } from "@/types"

export function MyCertificatesPage() {
    const { user } = useAuth()
    const employeeId = user?.employeeId ?? user?.id
    const { data: inscriptions = [], isLoading } = useQuery<Inscription[], Error>({
        queryKey: ["employeeInscriptions", employeeId],
        queryFn: () => inscriptionService.getByEmployee(employeeId ?? 0),
        enabled: !!employeeId,
    })

    const certificates = inscriptions.filter((inscription) => inscription.certificatGenere)

    if (isLoading) {
        return <div className="p-8">Loading certificates...</div>
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">My Certificates</h1>
                <p className="mt-2 text-sm text-muted-foreground">Download your earned certificates and review completion details.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {certificates.length ? (
                    certificates.map((inscription) => (
                        <Card key={inscription.id} className="rounded-3xl border-border shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <AwardIcon className="size-5 text-primary" />
                                    <CardTitle>{inscription.session.formation.titre}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Issued on {new Date(inscription.session.dateFin).toLocaleDateString()}</p>
                                <Button
                                    variant="outline"
                                    className="mt-4 w-full"
                                    onClick={() =>
                                        certificatService.download(
                                            inscription.id ?? 0,
                                            inscription.employee.nom
                                        )
                                    }
                                >
                                    <DownloadIcon className="size-4" /> Download
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>No certificates yet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Complete trainings to unlock your certificates.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
