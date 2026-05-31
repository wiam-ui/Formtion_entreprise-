import { useEffect, useState } from "react"
import { employeeService } from "@/services/employeeService"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlusIcon, Trash2Icon, SearchIcon, EditIcon, MailIcon, UserIcon, LockIcon, ShieldCheckIcon } from "lucide-react"
import type { Employee } from "@/types"
import { Role } from "@/types"
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

export default function EmployeesList() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // Form state
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [formData, setFormData] = useState<{
        nom: string;
        email: string;
        role: Role;
        motDePasse: string;
    }>({
        nom: "",
        email: "",
        role: Role.EMPLOYEE,
        motDePasse: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchEmployees = async () => {
        try {
            const data = await employeeService.getAll()
            setEmployees(data)
        } catch (error) {
            console.error("Failed to fetch employees", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    const handleOpenCreate = () => {
        setEditingEmployee(null)
        setFormData({ nom: "", email: "", role: Role.EMPLOYEE, motDePasse: "" })
        setIsSheetOpen(true)
    }

    const handleOpenEdit = (emp: Employee) => {
        setEditingEmployee(emp)
        setFormData({
            nom: emp.nom,
            email: emp.email,
            role: emp.role,
            motDePasse: "" // Don't show password
        })
        setIsSheetOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (editingEmployee && editingEmployee.id) {
                await employeeService.update(editingEmployee.id, formData)
            } else {
                await employeeService.create(formData)
            }
            setIsSheetOpen(false)
            fetchEmployees()
        } catch (error) {
            alert("Failed to save employee")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this employee?")) return
        try {
            await employeeService.delete(id)
            setEmployees(employees.filter(e => e.id !== id))
        } catch (error) {
            alert("Failed to delete employee")
        }
    }

    const filteredEmployees = employees.filter(e =>
        e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                    <p className="text-muted-foreground">Manage your organization's workforce and roles.</p>
                </div>
                <Button className="flex items-center gap-2 h-11 px-6 shadow-sm" onClick={handleOpenCreate}>
                    <UserPlusIcon className="h-5 w-5" /> Add New Employee
                </Button>
            </div>

            <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="relative group max-w-md">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-10 h-11 bg-white border-muted-foreground/20 focus:border-primary transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="p-4 text-left font-medium">Name</th>
                                    <th className="p-4 text-left font-medium">Email</th>
                                    <th className="p-4 text-left font-medium">Role</th>
                                    <th className="p-4 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-8 text-center">Loading...</td></tr>
                                ) : filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 font-medium">{emp.nom}</td>
                                            <td className="p-4 text-muted-foreground">{emp.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${emp.role === Role.HR ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {emp.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleOpenEdit(emp)}
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => emp.id && handleDelete(emp.id)}
                                                >
                                                    <Trash2Icon className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No employees found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-50 border-b">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {editingEmployee ? (
                                <><EditIcon className="h-5 w-5 text-primary" /> Edit Employee Profile</>
                            ) : (
                                <><UserPlusIcon className="h-5 w-5 text-primary" /> Create New Employee</>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            {editingEmployee ? "Modify the employee's information and access levels." : "Register a new employee into the system and assign their role."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 col-span-2">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-2 border-primary pl-2 uppercase tracking-tight">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="nom" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</FieldLabel>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="nom"
                                                placeholder="John Doe"
                                                className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</FieldLabel>
                                        <div className="relative group">
                                            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="j.doe@company.com"
                                                className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            <div className="space-y-4 col-span-2">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-2 border-primary pl-2 uppercase tracking-tight">Security & Access</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">System Role</FieldLabel>
                                        <div className="relative group">
                                            <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <select
                                                id="role"
                                                className="flex h-11 w-full rounded-md border border-muted-foreground/20 bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                            >
                                                <option value={Role.EMPLOYEE}>Employee</option>
                                                <option value={Role.HR}>HR Admin</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Field>

                                    {!editingEmployee && (
                                        <Field>
                                            <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Initial Password</FieldLabel>
                                            <div className="relative group">
                                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 h-11 border-muted-foreground/20 focus:border-primary transition-all"
                                                    value={formData.motDePasse}
                                                    onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </Field>
                                    )}
                                </div>
                                {!editingEmployee && (
                                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-dashed border-slate-200">
                                        Note: For security reasons, the user will be prompted to change this temporary password upon their first successful login.
                                    </p>
                                )}
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
                            <Button type="submit" className="h-11 px-8 font-semibold shadow-md min-w-40" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    editingEmployee ? "Update Profile" : "Create Account"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
