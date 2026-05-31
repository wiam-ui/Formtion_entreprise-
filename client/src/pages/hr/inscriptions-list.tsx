import { useEffect, useState } from "react"
import { inscriptionService } from "@/services/inscriptionService"
import { employeeService } from "@/services/employeeService"
import { sessionService } from "@/services/sessionService"
import { certificatService } from "@/services/certificatService"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DownloadIcon, CheckCircle2Icon, ClockIcon, AlertCircleIcon, UserPlusIcon } from "lucide-react"
import type { Inscription, Employee, Session } from "@/types"
import { InscriptionStatut } from "@/types"
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
import { UserIcon, BookOpenIcon, ChevronDownIcon } from "lucide-react"

export default function InscriptionsList() {
    const [inscriptions, setInscriptions] = useState<Inscription[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Form state
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [formData, setFormData] = useState({
        employeeId: 0,
        sessionId: 0
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchData = async () => {
        try {
            const [insData, empsData, sessData] = await Promise.all([
                inscriptionService.getAll(),
                employeeService.getAll(),
                sessionService.getAll()
            ])
            setInscriptions(insData)
            setEmployees(empsData)
            setSessions(sessData.filter(s => s.statut !== 'TERMINEE'))
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
        setFormData({
            employeeId: employees[0]?.id || 0,
            sessionId: sessions[0]?.id || 0
        })
        setIsSheetOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await inscriptionService.inscrire(formData)
            setIsSheetOpen(false)
            fetchData()
        } catch (error) {
            alert("Failed to enroll employee. Are they already enrolled?")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateStatut = async (id: number, currentStatut: InscriptionStatut) => {
        let nextStatut: InscriptionStatut = InscriptionStatut.INSCRIT
        if (currentStatut === InscriptionStatut.INSCRIT) nextStatut = InscriptionStatut.EN_COURS
        else if (currentStatut === InscriptionStatut.EN_COURS) nextStatut = InscriptionStatut.TERMINE
        else return

        try {
            await inscriptionService.updateProgression(id, nextStatut)
            fetchData()
        } catch (error) {
            alert("Failed to update status")
        }
    }

    const handleDownload = async (id: number, name: string) => {
        try {
            await certificatService.download(id, name)
        } catch (error) {
            alert("Certificate generation failed. Is the training completed?")
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Enrollment Tracking</h1>
                <Button className="flex items-center gap-2" onClick={handleOpenCreate}>
                    <UserPlusIcon className="h-4 w-4" /> Enroll Employee
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="rounded-md border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="p-4 text-left font-medium">Employee</th>
                                    <th className="p-4 text-left font-medium">Training</th>
                                    <th className="p-4 text-left font-medium">Status</th>
                                    <th className="p-4 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-8 text-center">Loading...</td></tr>
                                ) : inscriptions.length > 0 ? (
                                    inscriptions.map((ins) => (
                                        <tr key={ins.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium">{ins.employee.nom}</div>
                                                <div className="text-xs text-muted-foreground">{ins.employee.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{ins.session.formation.titre}</div>
                                                <div className="text-xs text-muted-foreground">Session #{ins.session.id}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {ins.statutProgression === InscriptionStatut.TERMINE ? (
                                                        <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                                                    ) : ins.statutProgression === InscriptionStatut.EN_COURS ? (
                                                        <ClockIcon className="h-4 w-4 text-blue-600" />
                                                    ) : (
                                                        <AlertCircleIcon className="h-4 w-4 text-gray-400" />
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ins.statutProgression === InscriptionStatut.TERMINE ? 'bg-green-100 text-green-700' :
                                                            ins.statutProgression === InscriptionStatut.EN_COURS ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {ins.statutProgression}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                {ins.statutProgression !== InscriptionStatut.TERMINE && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-blue-600"
                                                        onClick={() => ins.id && handleUpdateStatut(ins.id, ins.statutProgression)}
                                                    >
                                                        Next Step
                                                    </Button>
                                                )}
                                                {ins.statutProgression === InscriptionStatut.TERMINE && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-2 border-green-200 text-green-700 hover:bg-green-50"
                                                        onClick={() => ins.id && handleDownload(ins.id, ins.employee.nom)}
                                                    >
                                                        <DownloadIcon className="h-3 w-3" /> Certificate
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No inscriptions tracked yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-50 border-b">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <UserPlusIcon className="h-5 w-5 text-primary" /> Enroll Employee
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Select an employee and a training session to register them.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
                        <div className="space-y-6">
                            <Field>
                                <FieldLabel htmlFor="employee" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Employee</FieldLabel>
                                <div className="relative group">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <select
                                        id="employee"
                                        className="flex h-11 w-full rounded-md border border-muted-foreground/20 bg-background pl-10 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer"
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: parseInt(e.target.value) })}
                                        required
                                    >
                                        <option value="" disabled>Choose an employee...</option>
                                        {employees.map(e => (
                                            <option key={e.id} value={e.id}>{e.nom} ({e.email})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="session" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available Session</FieldLabel>
                                <div className="relative group">
                                    <BookOpenIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <select
                                        id="session"
                                        className="flex h-11 w-full rounded-md border border-muted-foreground/20 bg-background pl-10 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer"
                                        value={formData.sessionId}
                                        onChange={(e) => setFormData({ ...formData, sessionId: parseInt(e.target.value) })}
                                        required
                                    >
                                        <option value="" disabled>Select a session...</option>
                                        {sessions.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.formation.titre} — {new Date(s.dateDebut).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                {sessions.length === 0 && (
                                    <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                                        No active sessions available. Please create a session first.
                                    </p>
                                )}
                            </Field>
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
                            <Button
                                type="submit"
                                className="h-11 px-8 font-semibold shadow-md min-w-40"
                                disabled={isSubmitting || sessions.length === 0}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    "Confirm Enrollment"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
