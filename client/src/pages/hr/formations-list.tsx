import { useEffect, useState } from "react"
import { formationService } from "@/services/formationService"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Trash2Icon, EditIcon, BookOpenIcon } from "lucide-react"
import type { Formation } from "@/types"
import { Role } from "@/types"
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
import { ClockIcon, AlignLeftIcon, AwardIcon } from "lucide-react"

export default function FormationsList() {
    const { user } = useAuth()
    const isHR = user?.role === Role.HR
    const [formations, setFormations] = useState<Formation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Form state
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingFormation, setEditingFormation] = useState<Formation | null>(null)
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        duree: 0,
        competencesVisees: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchFormations = async () => {
        try {
            const data = await formationService.getAll()
            setFormations(data)
        } catch (error) {
            console.error("Failed to fetch formations", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchFormations()
    }, [])

    const handleOpenCreate = () => {
        setEditingFormation(null)
        setFormData({ titre: "", description: "", duree: 0, competencesVisees: "" })
        setIsSheetOpen(true)
    }

    const handleOpenEdit = (form: Formation) => {
        setEditingFormation(form)
        setFormData({
            titre: form.titre,
            description: form.description,
            duree: form.duree,
            competencesVisees: form.competencesVisees
        })
        setIsSheetOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (editingFormation && editingFormation.id) {
                await formationService.update(editingFormation.id, formData)
            } else {
                await formationService.create(formData)
            }
            setIsSheetOpen(false)
            fetchFormations()
        } catch (error) {
            alert("Failed to save formation")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this formation? This may affect existing sessions.")) return
        try {
            await formationService.delete(id)
            setFormations(formations.filter(f => f.id !== id))
        } catch (error) {
            alert("Failed to delete formation")
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Training Catalog</h1>
                {isHR && (
                    <Button className="flex items-center gap-2" onClick={handleOpenCreate}>
                        <PlusIcon className="h-4 w-4" /> New Formation
                    </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center">Loading...</div>
                ) : formations.length > 0 ? (
                    formations.map((form) => (
                        <Card key={form.id} className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all">
                            <CardHeader className="bg-primary/5 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <BookOpenIcon className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                                        {form.duree}h
                                    </span>
                                </div>
                                <CardTitle className="mt-4 line-clamp-1">{form.titre}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-2 h-10">
                                    {form.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    <div className="text-xs">
                                        <span className="font-bold block text-muted-foreground uppercase tracking-wider mb-1">Target Skills</span>
                                        <p className="line-clamp-2 text-sm italic">"{form.competencesVisees}"</p>
                                    </div>
                                    <div className={`flex justify-end gap-2 pt-2 border-t transition-opacity ${isHR ? 'opacity-0 group-hover:opacity-100' : 'hidden'}`}>
                                        <Button variant="outline" size="sm" className="h-8" onClick={() => handleOpenEdit(form)}>
                                            <EditIcon className="h-3 w-3 mr-1" /> Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => form.id && handleDelete(form.id)}
                                        >
                                            <Trash2Icon className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                        No training programs found. Start by creating one!
                    </div>
                )}
            </div>

            <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-50 border-b">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {editingFormation ? (
                                <><EditIcon className="h-5 w-5 text-primary" /> Edit Formation Details</>
                            ) : (
                                <><PlusIcon className="h-5 w-5 text-primary" /> Create New Formation</>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            {editingFormation ? "Update the course information and objectives." : "Register a new training program in the catalog."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
                        <div className="space-y-6">
                            {/* Section: Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-2 border-primary pl-2 uppercase tracking-tight">Course Information</h3>
                                <Field>
                                    <FieldLabel htmlFor="titre" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Formation Title</FieldLabel>
                                    <div className="relative group">
                                        <BookOpenIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="titre"
                                            placeholder="e.g. Advanced Project Management"
                                            className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                            value={formData.titre}
                                            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                            required
                                        />
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</FieldLabel>
                                    <div className="relative group">
                                        <AlignLeftIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <textarea
                                            id="description"
                                            placeholder="Provide a brief overview of the training..."
                                            className="flex min-h-[100px] w-full rounded-md border border-muted-foreground/20 bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                </Field>
                            </div>

                            {/* Section: Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-2 border-primary pl-2 uppercase tracking-tight">Technical Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="duree" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration (Hours)</FieldLabel>
                                        <div className="relative group">
                                            <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="duree"
                                                type="number"
                                                placeholder="0"
                                                className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                                value={formData.duree}
                                                onChange={(e) => setFormData({ ...formData, duree: parseInt(e.target.value) })}
                                                required
                                            />
                                        </div>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="competencesVisees" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Skills</FieldLabel>
                                        <div className="relative group">
                                            <AwardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="competencesVisees"
                                                placeholder="React, SQL, Leadership..."
                                                className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                                value={formData.competencesVisees}
                                                onChange={(e) => setFormData({ ...formData, competencesVisees: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Field>
                                </div>
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
                                        Saving...
                                    </span>
                                ) : (
                                    editingFormation ? "Update Formation" : "Create Formation"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
