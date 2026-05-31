import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Employee, Formation, Session, Inscription } from "@/types"
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { employeeService } from "@/services/employeeService"
import { formationService } from "@/services/formationService"
import { sessionService } from "@/services/sessionService"
import { inscriptionService } from "@/services/inscriptionService"
import {
    UsersIcon,
    BookOpenIcon,
    CalendarIcon,
    ClipboardCheckIcon,
    AwardIcon,
    TrendingUpIcon
} from "lucide-react"
import {XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

export function HRDashboard() {
    const {
        data: employees = [],
        isLoading: loadingEmployees,
    } = useQuery<Employee[], Error>({ queryKey: ["employees"], queryFn: employeeService.getAll })
    const {
        data: formations = [],
        isLoading: loadingFormations,
    } = useQuery<Formation[], Error>({ queryKey: ["formations"], queryFn: formationService.getAll })
    const {
        data: sessions = [],
        isLoading: loadingSessions,
    } = useQuery<Session[], Error>({ queryKey: ["sessions"], queryFn: sessionService.getAll })
    const {
        data: inscriptions = [],
        isLoading: loadingInscriptions,
    } = useQuery<Inscription[], Error>({ queryKey: ["inscriptions"], queryFn: inscriptionService.getAll })

    const isLoading = loadingEmployees || loadingFormations || loadingSessions || loadingInscriptions
    const completedCount = inscriptions.filter((inscription) => inscription.statutProgression === "TERMINE").length
    const inProgressCount = inscriptions.filter((inscription) => inscription.statutProgression === "EN_COURS").length
    const notStartedCount = inscriptions.filter((inscription) => inscription.statutProgression === "INSCRIT").length
    const certificateCount = inscriptions.filter((inscription) => inscription.certificatGenere).length
    const completionRate = inscriptions.length ? Math.round((completedCount / inscriptions.length) * 100) : 0

    const enrollmentEvolution = useMemo(() => {
        const counts = Array.from({ length: 12 }, (_, index) => ({
            month: new Date(0, index).toLocaleString("default", { month: "short" }),
            enrollments: 0,
        }))
        inscriptions.forEach((inscription) => {
            const monthIndex = new Date(inscription.session.dateDebut).getMonth()
            counts[monthIndex].enrollments += 1
        })
        return counts
    }, [inscriptions])

    const statusOverview = [
        { name: "Completed", value: completedCount, color: "#22c55e" },
        { name: "In Progress", value: inProgressCount, color: "#0ea5e9" },
        { name: "Not Started", value: notStartedCount, color: "#f97316" },
    ]

    // recentEnrollments removed (not used) to avoid unused variable

    const upcomingSessions = useMemo(
        () =>
            sessions
                .filter((session) => new Date(session.dateDebut) > new Date())
                .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime())
                .slice(0, 5),
        [sessions]
    )

    const progressRanking = useMemo(
        () =>
            employees
                .map((employee) => {
                    const employeeEnrollments = inscriptions.filter((inscription) => inscription.employee.id === employee.id)
                    const completed = employeeEnrollments.filter((inscription) => inscription.statutProgression === "TERMINE").length
                    const progress = employeeEnrollments.length ? Math.round((completed / employeeEnrollments.length) * 100) : 0
                    return {
                        employee: employee.nom,
                        department: "Learning & Development",
                        progress,
                        certificates: employeeEnrollments.filter((inscription) => inscription.certificatGenere).length,
                    }
                })
                .sort((a, b) => b.progress - a.progress)
                .slice(0, 6),
        [employees, inscriptions]
    )



    if (isLoading) {
        return <div className="p-8">Loading dashboard...</div>
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">HR Portal</span>
                        <span>Enterprise training management for HR operations.</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight">HR Training Command Center</h1>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                    {
                        title: "Total Employees",
                        value: employees.length,
                        icon: UsersIcon,
                        color: "text-sky-600",
                    },
                    {
                        title: "Total formations",
                        value: formations.length,
                        icon: BookOpenIcon,
                        color: "text-emerald-600",
                    },
                    {
                        title: "Active Sessions",
                        value: sessions.filter((session) => new Date(session.dateFin) > new Date()).length,
                        icon: CalendarIcon,
                        color: "text-violet-600",
                    },
                    {
                        title: "Inscriptions",
                        value: inscriptions.length,
                        icon: ClipboardCheckIcon,
                        color: "text-orange-600",
                    },
                    {
                        title: "Certificates",
                        value: certificateCount,
                        icon: AwardIcon,
                        color: "text-emerald-600",
                    },
                    {
                        title: "Completion Rate",
                        value: `${completionRate}%`,
                        icon: TrendingUpIcon,
                        color: "text-sky-600",
                    },
                ].map((card) => (
                    <Card key={card.title} className="rounded-3xl border-border shadow-sm">
                        <CardHeader className="flex items-center justify-between gap-2 pb-3">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <card.icon className={`h-5 w-5 ${card.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{card.value}</div>
                            <div className="mt-2 text-sm text-muted-foreground">Compared to last month</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
                <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="rounded-3xl border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Enrollment Evolution</CardTitle>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={enrollmentEvolution} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="enrollments" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Training Status Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={statusOverview} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={4}>
                                            {statusOverview.map((entry) => (
                                                <Cell key={entry.name} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid gap-4">
                  

                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Upcoming Sessions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingSessions.map((session) => (
                                <div key={session.id} className="rounded-2xl border border-slate-200 p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="font-semibold">{session.formation.titre}</p>
                                            <p className="text-sm text-muted-foreground">Trainer: {session.formateur}</p>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{new Date(session.dateDebut).toLocaleDateString()}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">Seats available: 12</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div>
                <Card className="rounded-3xl border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Employee Progress Ranking</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-muted-foreground">
                            <thead>
                                <tr>
                                    <th className="pb-3 font-medium">Employee</th>
                                    <th className="pb-3 font-medium">Department</th>
                                    <th className="pb-3 font-medium">Progress</th>
                                    <th className="pb-3 font-medium">Certificates</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progressRanking.map((item) => (
                                    <tr key={item.employee} className="border-t border-slate-200/70">
                                        <td className="py-3 font-medium text-slate-900">{item.employee}</td>
                                        <td className="py-3">{item.department}</td>
                                        <td className="py-3">
                                            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                                <div className="h-2 rounded-full bg-sky-600" style={{ width: `${item.progress}%` }} />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{item.progress}%</span>
                                        </td>
                                        <td className="py-3">{item.certificates}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
