import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { inscriptionService } from "@/services/inscriptionService"
import { certificatService } from "@/services/certificatService"
import { BookOpenIcon, DownloadIcon } from "lucide-react"
import type { Inscription } from "@/types"
import { InscriptionStatut } from "@/types"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"

export function UserDashboard() {
    const { user } = useAuth()
    const [activeModal, setActiveModal] = useState(false)

    const employeeId = user?.employeeId ?? user?.id

    const {
        data: inscriptions = [],
        isLoading: loadingInscriptions,
    } = useQuery<Inscription[], Error>({
        queryKey: ["employeeInscriptions", employeeId],
        queryFn: () => inscriptionService.getByEmployee(employeeId ?? 0),
        enabled: !!employeeId,
    })

    const normalizeStatut = (statut?: string) => statut?.trim().toUpperCase() ?? ""
    const matchesStatut = (statut?: string, target?: string) => normalizeStatut(statut) === normalizeStatut(target)

    const isLoading = loadingInscriptions
    const completedCount = inscriptions.filter((inscription) => matchesStatut(inscription.statutProgression, InscriptionStatut.TERMINE)).length
    const inProgressCount = inscriptions.filter((inscription) => matchesStatut(inscription.statutProgression, InscriptionStatut.EN_COURS)).length

    console.log("Completed trainings:", completedCount)
    const totalTrainings = inscriptions.length
    // console.log("Total trainings:", totalTrainings)

    const progressRate = totalTrainings ? Math.round(((completedCount + inProgressCount * 0.5) / totalTrainings) * 100) : 0
    const latestTraining = inscriptions.find((inscription) => matchesStatut(inscription.statutProgression, InscriptionStatut.EN_COURS)) ?? inscriptions[0]
    const upcomingSessions = inscriptions
        .filter((inscription) => new Date(inscription.session.dateDebut) > new Date())
        .sort((a, b) => new Date(a.session.dateDebut).getTime() - new Date(b.session.dateDebut).getTime())
        .slice(0, 5)
    const certificateList = inscriptions.filter((inscription) => inscription.certificatGenere)
    const calendarEvents = upcomingSessions.map((inscription) => ({
        title: inscription.session.formation.titre,
        date: new Date(inscription.session.dateDebut).toLocaleDateString(),
    }))

    if (isLoading) {
        return <div className="p-8">Loading your dashboard...</div>
    }

    return (
        <div className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Welcome {user?.fullname}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{user?.role === "HR" ? "HR Manager Dashboard" : "Employee learning workspace"}</p>
                </div>
                <Card className="rounded-3xl border-border bg-primary/5 shadow-sm">
                    <CardHeader>
                        <CardTitle>Parcours d'apprentissage</CardTitle>
                        <CardDescription>Rôle actuel et perspectives d'évolution</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="flex justify-between gap-4">
                                <span>Department</span>
                                <span className="font-medium">IT</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span>Position</span>
                                <span className="font-medium">Spécialiste de la formation</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span>Current path</span>
                                <span className="font-medium">Leadership Excellence</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-3xl border-border shadow-sm">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Achèvement global</CardTitle>
                        <BookOpenIcon className="size-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="relative flex h-40 w-full items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-slate-200" />
                            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-sm">
                                <span className="text-3xl font-semibold">{progressRate}%</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">Votre progression d'apprentissage est conforme aux attentes. Concentrez-vous sur la prochaine étape.</p>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Formations suivies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-semibold">{totalTrainings}</div>
                        <p className="mt-2 text-sm text-muted-foreground">Sessions de formation actives et à venir.</p>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Successions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span>Completed</span>
                            <strong>{completedCount}</strong>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>In progress</span>
                            <strong>{inProgressCount}</strong>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>Certificates</span>
                            <strong>{certificateList.length}</strong>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
                <div className="grid gap-4">
                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle>Mes inscriptions</CardTitle>
                            <CardDescription>Suivre les progrès et le statut</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {inscriptions.length ? (
                                inscriptions.map((inscription) => (
                                    <div key={inscription.id} className="rounded-3xl border border-slate-200 p-4 shadow-sm">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-semibold">{inscription.session.formation.titre}</p>
                                                <p className="text-sm text-muted-foreground">Entraîneur: {inscription.session.formateur}</p>
                                            </div>
                                            <div className="text-right text-sm text-muted-foreground">
                                                <p>{new Date(inscription.session.dateDebut).toLocaleDateString()} - {new Date(inscription.session.dateFin).toLocaleDateString()}</p>
                                                <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                                                    {inscription.statutProgression.replace("_", " ")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div className="h-2 rounded-full bg-primary" style={{ width: `${inscription.statutProgression === "TERMINE" ? 100 : inscription.statutProgression === "EN_COURS" ? 65 : 18}%` }} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucune formation n'est encore prévue. Veuillez contacter votre équipe RH.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Continuer l'apprentissage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestTraining ? (
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-semibold">{latestTraining.session.formation.titre}</p>
                                        <p className="text-sm text-muted-foreground">{latestTraining.session.formateur}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-100 p-4">
                                        <p className="text-sm">Due by {new Date(latestTraining.session.dateFin).toLocaleDateString()}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Status: {latestTraining.statutProgression.replace("_", " ")}</p>
                                    </div>
                                    <Button onClick={() => setActiveModal(true)}>Continuer la formation</Button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucune formation active à continuer pour le moment.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4">
                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Session à venir</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingSessions.length ? (
                                upcomingSessions.map((inscription) => (
                                    <div key={inscription.id} className="rounded-2xl border border-slate-200 p-4">
                                        <p className="font-semibold">{inscription.session.formation.titre}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(inscription.session.dateDebut).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucune séance à venir programmée.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Certificates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {certificateList.length ? (
                                certificateList.map((inscription) => (
                                    <div key={inscription.id} className="rounded-2xl border border-slate-200 p-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <p className="font-medium">{inscription.session.formation.titre}</p>
                                                <p className="text-xs text-muted-foreground">Publié le {new Date(inscription.session.dateFin).toLocaleDateString()}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    certificatService.download(
                                                        inscription.id ?? 0,
                                                        inscription.employee.nom
                                                    )
                                                }
                                            >
                                                <DownloadIcon className="size-4" /> Télécharger
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucun certificat disponible pour le moment.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Calendrier d'apprentissage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {calendarEvents.map((event) => (
                                <div key={`${event.date}-${event.title}`} className="rounded-2xl bg-slate-100 p-3 text-sm">
                                    <p className="font-medium">{event.title}</p>
                                    <p className="text-muted-foreground">{event.date}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet open={activeModal} onOpenChange={setActiveModal}>
                <SheetContent
                    side="center"
                    className="max-h-[90vh] w-[min(95vw,48rem)] overflow-y-auto rounded-3xl p-0 shadow-2xl"
                >
                    <SheetHeader className="rounded-t-3xl bg-slate-950 px-6 py-5 text-white">
                        <SheetTitle className="text-2xl">Continuer la formation</SheetTitle>
                        <SheetDescription className="text-sm text-slate-300">Reprenez le parcours en cours et terminez le module en attente.</SheetDescription>
                    </SheetHeader>
                    <div className="rounded-b-3xl bg-white p-6">
                        <Card className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">Formation active</p>
                                    <h3 className="text-xl font-semibold">{latestTraining?.session.formation.titre}</h3>
                                    <p className="text-sm text-muted-foreground">{latestTraining?.session.formateur}</p>
                                </div>
                                <div className="rounded-3xl bg-primary/10 px-4 py-3 text-primary shadow-sm">
                                    <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Statut</p>
                                    <p className="mt-1 text-lg font-semibold">{latestTraining?.statutProgression.replace("_", " ")}</p>
                                </div>
                            </div>
                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-3xl bg-white p-4 shadow-sm">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Début</p>
                                    <p className="mt-2 font-semibold">{new Date(latestTraining?.session.dateDebut ?? "").toLocaleDateString()}</p>
                                </div>
                                <div className="rounded-3xl bg-white p-4 shadow-sm">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Fin prévue</p>
                                    <p className="mt-2 font-semibold">{new Date(latestTraining?.session.dateFin ?? "").toLocaleDateString()}</p>
                                </div>
                                <div className="rounded-3xl bg-white p-4 shadow-sm">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Progression</p>
                                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                                        <div className="h-3 rounded-full bg-primary" style={{ width: `${latestTraining?.statutProgression === "TERMINE" ? 100 : latestTraining?.statutProgression === "EN_COURS" ? 65 : 18}%` }} />
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

