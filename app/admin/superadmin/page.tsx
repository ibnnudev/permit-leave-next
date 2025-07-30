import { requireRole } from "@/lib/auth"
import { getAllEmployee } from "@/service/employee"
import { getAllLeave } from "@/service/leave"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, CheckCircle, XCircle, Calendar, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { LeaveStatus, Role } from "@prisma/client"


import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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

                    <div>
                        <div className="lg:flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold">Pengajuan Cuti Terbaru</h2>
                                <p className="text-gray-600 mb-6">
                                    Berikut adalah daftar pengajuan cuti terbaru dari karyawan kamu.
                                </p>
                            </div>
                            <Link href={"/admin/leave-requests"} className="text-blue-600 hover:underline">
                                <Button variant={"default"} size="sm">
                                    Lihat Semua Pengajuan <ArrowUpRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        {/* Pengajuan Terbaru */}
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Jenis Cuti</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Durasi</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentRequestsLimited.length > 0 ? (
                                        recentRequestsLimited.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell className="font-medium">{request.employee.name}</TableCell>
                                                <TableCell>{request.leaveType.name}</TableCell>
                                                <TableCell>
                                                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
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
                                                                        : "N/A"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {Math.ceil(
                                                        (new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 3600 * 24)
                                                    ) + 1}{" "}
                                                    Hari
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size={"sm"} variant={'outline'} asChild>
                                                        <Link href={`/admin/leave-requests/${request.id}`}>
                                                            Tinjau <ArrowUpRight className="inline h-4 w-4 ml-1" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                                                Belum ada pengajuan cuti nih
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>


                    <div>
                        <div className="lg:flex items-center justify-between mb-2 mt-8">
                            <div>
                                <h2 className="text-xl font-semibold">Pengajuan Cuti yang Masih Menunggu</h2>
                                <p className="text-gray-600 mb-6">
                                    Berikut adalah daftar pengajuan cuti yang masih menunggu persetujuan.
                                </p>
                            </div>
                            <Link href={"/admin/leave-requests?status=pending"} className="text-blue-600 hover:underline">
                                <Button variant={"default"} size="sm">Lihat Semua Pengajuan <ArrowUpRight className="h-4 w-4" /></Button>
                            </Link>
                        </div>

                        {/* Cuti yang Masih Nunggu */}
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Jenis Cuti</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingRequests.length > 0 ? (
                                        pendingRequests.slice(0, 5).map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.employee.name}</TableCell>
                                                <TableCell>{request.leaveType.name}</TableCell>
                                                <TableCell>
                                                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size={"sm"} variant={'outline'} asChild>
                                                        <Link href={`/admin/leave-requests/${request.id}`}>
                                                            Tinjau <ArrowUpRight className="inline h-4 w-4 ml-1" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                                Belum ada yang nunggu disetujui
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>

                    {pendingRequests.length > 5 && (
                        <div className="mt-4 text-center">
                            <Button variant="outline" asChild>
                                <Link href="/admin/leave-requests?status=pending">Lihat Semua yang Menunggu</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
