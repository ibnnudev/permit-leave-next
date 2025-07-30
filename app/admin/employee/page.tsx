import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth"
import { getLeaveQuotaByUser, getLeaveByUserId } from "@/service/leave"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Role, LeaveStatus } from "@prisma/client"

export default async function EmployeeDashboard() {
    const user = await requireRole([Role.EMPLOYEE]);

    if (user.role !== Role.EMPLOYEE) {
        if (user.role === Role.SUPERADMIN) {
            redirect("/superadmin/dashboard")
        } else {
            redirect("/admin/dashboard")
        }
    }

    const [leaveList, quotaList] = await Promise.all([
        getLeaveByUserId(user.id),
        getLeaveQuotaByUser(user.id),
    ])

    const recentLeave = leaveList.slice(0, 5)
    const userStats = {
        pending_requests: leaveList.filter(leave => leave.status === LeaveStatus.PENDING).length,
        process_requests: leaveList.filter(leave => leave.status === LeaveStatus.IN_PROCESS).length,
        approved_requests: leaveList.filter(leave => leave.status === LeaveStatus.APPROVED).length,
        total_days_taken: quotaList?.reduce((total: number, quota: any) => total + (quota.quota_total - quota.quota_used), 0),
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {user.name}!</h1>
                        <p className="text-gray-600">
                            {user.position} • {user.institution.name}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Pengajuan Pending"
                            value={userStats.pending_requests}
                            description="Menunggu review"
                            icon={Clock}
                        />
                        <StatsCard
                            title="Dalam Proses"
                            value={userStats.process_requests}
                            description="Sedang diproses"
                            icon={FileText}
                        />
                        <StatsCard
                            title="Pengajuan Disetujui"
                            value={userStats.approved_requests}
                            description="Tahun ini"
                            icon={CheckCircle}
                        />
                        <StatsCard
                            title="Total Hari Cuti"
                            value={userStats.total_days_taken || 0}
                            description="Tahun ini"
                            icon={Calendar}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Leave Requests */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Pengajuan Cuti Terbaru</CardTitle>
                                    <CardDescription>Riwayat pengajuan cuti Anda</CardDescription>
                                </div>
                                <Button asChild size="sm">
                                    <Link href="/cuti/new">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Ajukan Cuti
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentLeave.length > 0 ? (
                                        recentLeave.map((leave) => (
                                            <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{leave.leaveType.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(leave.start_date).toLocaleDateString("id-ID")} -{" "}
                                                        {new Date(leave.end_date).toLocaleDateString("id-ID")}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{
                                                        new Date(leave.start_date).toLocaleDateString("id-ID") ===
                                                            new Date(leave.end_date).toLocaleDateString("id-ID")
                                                            ? "1 hari"
                                                            : `${Math.ceil(
                                                                (new Date(leave.end_date).getTime() -
                                                                    new Date(leave.start_date).getTime()) /
                                                                (1000 * 3600 * 24)
                                                            )} hari`
                                                    }</p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        leave.status === LeaveStatus.APPROVED
                                                            ? "default"
                                                            : leave.status === LeaveStatus.REJECTED
                                                                ? "destructive"
                                                                : leave.status === LeaveStatus.IN_PROCESS
                                                                    ? "secondary"
                                                                    : "outline"
                                                    }
                                                >
                                                    {leave.status === LeaveStatus.APPROVED
                                                        ? "Disetujui"
                                                        : leave.status === LeaveStatus.REJECTED
                                                            ? "Ditolak"
                                                            : leave.status === LeaveStatus.IN_PROCESS
                                                                ? "Dalam Proses"
                                                                : "Menunggu"}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Belum ada pengajuan cuti</p>
                                    )}
                                </div>
                                {leaveList.length > 5 && (
                                    <div className="mt-4 text-center">
                                        <Button variant="outline" asChild>
                                            <Link href="/cuti">Lihat Semua Pengajuan</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Leave Balance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Sisa Kuota Cuti</CardTitle>
                                <CardDescription>Kuota cuti Anda tahun ini</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {quotaList.length > 0 ? (
                                        quotaList.map((quota) => (
                                            <div key={quota.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{quota.leaveType.name}</p>
                                                    <p className="text-sm text-gray-600">Kuota tahunan</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg">
                                                        {quota.total_quota - quota.used_quota} hari
                                                    </p>
                                                    <p className="text-sm text-gray-500">dari {quota.total_quota} hari</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Kuota cuti belum diatur</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
