import { requireRole } from "@/lib/auth"
import { getAllEmployee } from "@/service/employee"
import { getAllLeave } from "@/service/leave"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, CheckCircle, XCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { LeaveStatus, Role } from "@prisma/client"

export default async function AdminDashboard() {
    const user = await requireRole([Role.SUPERADMIN])

    const [recentRequests, employees] = await Promise.all([getAllLeave(), getAllEmployee()])

    const recentRequestsLimited = recentRequests.slice(0, 8)
    const pendingRequests = recentRequests.filter((req) => req.status == LeaveStatus.PENDING)

    const stats = {
        pending_requests: pendingRequests.length,
        approved_requests: recentRequests.filter((req) => req.status === LeaveStatus.APPROVED).length,
        rejected_requests: recentRequests.filter((req) => req.status === LeaveStatus.REJECTED).length,
        total_days_taken: recentRequests.reduce((total, req) => {
            let days = 0
            if (req.status === LeaveStatus.APPROVED) {
                const startDate = new Date(req.start_date)
                const endDate = new Date(req.end_date)
                days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1
            }
            return total + days
        }, 0),
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Selamat Datang, {user.name} 👋</h1>
                        <p className="text-gray-600">Pantau karyawan & pengajuan cuti di sini, Boss!</p>
                    </div>

                    {/* Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <StatsCard
                            title="Total Karyawan"
                            value={employees.length}
                            description="Yang masih aktif kerja"
                            icon={Users}
                            iconColor="text-blue-500"
                        />
                        <StatsCard
                            title="Cuti Menunggu"
                            value={stats.pending_requests || 0}
                            description="Belum disetujui nih"
                            icon={Clock}
                            iconColor="text-yellow-500"
                        />
                        <StatsCard
                            title="Cuti Disetujui"
                            value={stats.approved_requests || 0}
                            description="Sepanjang tahun ini"
                            icon={CheckCircle}
                            iconColor="text-green-500"
                        />
                        <StatsCard
                            title="Cuti Ditolak"
                            value={stats.rejected_requests || 0}
                            description="Udah kamu tolak"
                            icon={XCircle}
                            iconColor="text-red-500"
                        />
                        <StatsCard
                            title="Total Hari Cuti"
                            value={stats.total_days_taken || 0}
                            description="Yang udah diambil tahun ini"
                            icon={Calendar}
                            iconColor="text-purple-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pengajuan Terbaru */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Pengajuan Cuti Terbaru</CardTitle>
                                    <CardDescription>Data cuti yang baru aja masuk</CardDescription>
                                </div>
                                <Button asChild size="sm">
                                    <Link href="/admin/leave-requests">Lihat Semua</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentRequestsLimited.length > 0 ? (
                                        recentRequestsLimited.map((request) => (
                                            <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{request.employee.name}</p>
                                                    <p className="text-sm text-gray-600">{request.leaveType.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                                                        {new Date(request.end_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge
                                                        variant={
                                                            request.status === LeaveStatus.APPROVED
                                                                ? "success"
                                                                : request.status === LeaveStatus.PENDING
                                                                    ? "secondary"
                                                                    : request.status === LeaveStatus.IN_PROCESS
                                                                        ? "info"
                                                                        : request.status === LeaveStatus.REJECTED
                                                                            ? "destructive"
                                                                            : "secondary"
                                                        }
                                                    >
                                                        {request.status === LeaveStatus.APPROVED
                                                            ? "Disetujui"
                                                            : request.status === LeaveStatus.PENDING
                                                                ? "Menunggu"
                                                                : request.status === LeaveStatus.REJECTED
                                                                    ? "Ditolak"
                                                                    : request.status === LeaveStatus.IN_PROCESS
                                                                        ? "Sedang Diproses"
                                                                        : "Nggak Diketahui"
                                                        }
                                                    </Badge>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {
                                                            request.start_date && request.end_date ? (
                                                                <span>
                                                                    {Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 3600 * 24) + 1)} Hari
                                                                </span>
                                                            ) : (
                                                                <span>-</span>
                                                            )
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Belum ada pengajuan cuti nih</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cuti yang Masih Nunggu */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Perlu Disetujui Nih</CardTitle>
                                    <CardDescription>Pengajuan cuti yang nunggu lampu hijau dari kamu</CardDescription>
                                </div>
                                <Badge variant="secondary">{pendingRequests.length}</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {pendingRequests.length > 0 ? (
                                        pendingRequests.slice(0, 5).map((request) => (
                                            <div
                                                key={request.id}
                                                className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200"
                                            >
                                                <div>
                                                    <p className="font-medium">{request.employee.name}</p>
                                                    <p className="text-sm text-gray-600">{request.leaveType.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {request.start_date && request.end_date ? (
                                                            <span>
                                                                {new Date(request.start_date).toLocaleDateString()} -{" "}
                                                                {new Date(request.end_date).toLocaleDateString()}
                                                            </span>
                                                        ) : (
                                                            <span>-</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <Button size="sm" asChild>
                                                    <Link href={`/admin/leave-requests/${request.id}`}>Tinjau</Link>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Belum ada yang nunggu disetujui</p>
                                    )}
                                </div>
                                {pendingRequests.length > 5 && (
                                    <div className="mt-4 text-center">
                                        <Button variant="outline" asChild>
                                            <Link href="/admin/leave-requests?status=pending">Lihat Semua yang Menunggu</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
