import { useEffect, useState } from "react"
import { sessionService } from "@/services/sessionService"
import { formationService } from "@/services/formationService"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, UserIcon, PlusIcon, Trash2Icon, EditIcon, BookOpenIcon } from "lucide-react"
import type { Session, Formation } from "@/types"
import { SessionStatut, Role } from "@/types"
import { useAuth } from "@/hooks/use-auth"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Field,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon, AlignLeftIcon } from "lucide-react"

export default function SessionsList() {
    const { user } = useAuth()
    const isHR = user?.role === Role.HR
    const [sessions, setSessions] = useState<Session[]>([])
    const [formations, setFormations] = useState<Formation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Form state
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingSession, setEditingSession] = useState<Session | null>(null)
    const [formData, setFormData] = useState<{
        formationId: number;
        dateDebut: string;
        dateFin: string;
        formateur: string;
        statut: SessionStatut;
    }>({
        formationId: 0,
        dateDebut: "",
        dateFin: "",
        formateur: "",
        statut: SessionStatut.A_VENIR
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchData = async () => {
        try {
            const [sessionsData, formationsData] = await Promise.all([
                sessionService.getAll(),
                formationService.getAll()
            ])
            setSessions(sessionsData)
            setFormations(formationsData)
        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleOpenCreate = () => {
        setEditingSession(null)
        setFormData({
            formationId: formations[0]?.id || 0,
            dateDebut: "",
            dateFin: "",
            formateur: "",
            statut: SessionStatut.A_VENIR
        })
        setIsSheetOpen(true)
    }

    const handleOpenEdit = (session: Session) => {
        setEditingSession(session)
        setFormData({
            formationId: session.formation.id || 0,
            dateDebut: session.dateDebut,
            dateFin: session.dateFin,
            formateur: session.formateur,
            statut: session.statut
        })
        setIsSheetOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (editingSession && editingSession.id) {
                await sessionService.update(editingSession.id, formData)
            } else {
                await sessionService.create(formData)
            }
            setIsSheetOpen(false)
            fetchData()
        } catch (error) {
            alert("Failed to save session")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Cancel this session? All inscriptions will be affected.")) return
        try {
            await sessionService.delete(id)
            setSessions(sessions.filter(s => s.id !== id))
        } catch (error) {
            alert("Failed to delete session")
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Training Sessions</h1>
                {isHR && (
                    <Button className="flex items-center gap-2" onClick={handleOpenCreate}>
                        <PlusIcon className="h-4 w-4" /> Schedule Session
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : sessions.length > 0 ? (
                    sessions.map((session) => (
                        <Card key={session.id} className="overflow-hidden group">
                            <div className="flex flex-col md:flex-row">
                                <div className="bg-primary/5 p-6 flex flex-col justify-center items-center border-r md:w-48 text-center">
                                    <span className="text-xs font-bold text-muted-foreground uppercase">From</span>
                                    <span className="text-lg font-bold">{new Date(session.dateDebut).toLocaleDateString()}</span>
                                    <div className="h-4 w-px bg-muted-foreground/20 my-1" />
                                    <span className="text-xs font-bold text-muted-foreground uppercase">To</span>
                                    <span className="text-lg font-bold">{new Date(session.dateFin).toLocaleDateString()}</span>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-primary">{session.formation.titre}</h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <UserIcon className="h-3 w-3" /> {session.formateur}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" /> {session.statut}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex gap-2 transition-opacity ${isHR ? 'opacity-0 group-hover:opacity-100' : 'hidden'}`}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleOpenEdit(session)}
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                onClick={() => session.id && handleDelete(session.id)}
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${session.statut === SessionStatut.A_VENIR ? 'bg-blue-100 text-blue-700' :
                                            session.statut === SessionStatut.EN_COURS ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {session.statut.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                        No sessions scheduled yet.
                    </div>
                )}
            </div>

            <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-50 border-b">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {editingSession ? (
                                <><EditIcon className="h-5 w-5 text-primary" /> Edit Session Schedule</>
                            ) : (
                                <><PlusIcon className="h-5 w-5 text-primary" /> Schedule New Session</>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            {editingSession ? "Modify the session dates, trainer, or status." : "Select a training program and set the schedule for a new session."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
                        <div className="space-y-6">
                            {/* Section: Formation & Trainer */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-2 border-primary pl-2 uppercase tracking-tight">General Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="formation" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Formation</FieldLabel>
                                        <div className="relative group">
                                            <BookOpenIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <select
                                                id="formation"
                                                className="flex h-11 w-full rounded-md border border-muted-foreground/20 bg-background pl-10 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer"
                                                value={formData.formationId}
                                                onChange={(e) => setFormData({ ...formData, formationId: parseInt(e.target.value) })}
                                                disabled={!!editingSession}
                                            >
                                                {formations.map(f => (
                                                    <option key={f.id} value={f.id}>{f.titre}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="formateur" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trainer Name</FieldLabel>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="formateur"
                                                placeholder="e.g. Jane Smith"
                                                className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                                value={formData.formateur}
                                                onChange={(e) => setFormData({ ...formData, formateur: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            {/* Section: Schedule */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-2 border-primary pl-2 uppercase tracking-tight">Schedule & Status</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="dateDebut" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Date</FieldLabel>
                                        <div className="relative group">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="dateDebut"
                                                type="date"
                                                className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                                value={formData.dateDebut}
                                                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="dateFin" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">End Date</FieldLabel>
                                        <div className="relative group">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="dateFin"
                                                type="date"
                                                className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                                value={formData.dateFin}
                                                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel htmlFor="statut" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</FieldLabel>
                                    <div className="relative group">
                                        <AlignLeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <select
                                            id="statut"
                                            className="flex h-11 w-full rounded-md border border-muted-foreground/20 bg-background pl-10 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer"
                                            value={formData.statut}
                                            onChange={(e) => setFormData({ ...formData, statut: e.target.value as SessionStatut })}
                                        >
                                            <option value={SessionStatut.A_VENIR}>A Venir (Upcoming)</option>
                                            <option value={SessionStatut.EN_COURS}>En Cours (Active)</option>
                                            <option value={SessionStatut.TERMINEE}>Terminée (Completed)</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Field>
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsSheetOpen(false)}
                                className="h-11 px-6 font-medium"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="h-11 px-8 font-semibold shadow-md min-w-[160px]" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    editingSession ? "Update Session" : "Schedule Session"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
