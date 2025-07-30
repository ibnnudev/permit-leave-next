import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth"
import { getCutiKuotaByUser, getCutiByUserId } from "@/service/leave"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Peran, StatusCuti } from "@prisma/client"

export default async function EmployeeDashboard() {
    const user = await requireRole([Peran.KARYAWAN]);
    console.log("Current user:", user);

    if (user.peran !== Peran.KARYAWAN) {
        if (user.peran === Peran.SUPERADMIN) {
            redirect("/superadmin/dashboard")
        } else {
            redirect("/admin/dashboard")
        }
    }

    const [cutiList, kuotaList] = await Promise.all([
        getCutiByUserId(user.id),
        getCutiKuotaByUser(user.id),
    ])

    const recentCuti = cutiList.slice(0, 5)
    const userStats = {
        pending_requests: cutiList.filter(cuti => cuti.status === StatusCuti.PENDING).length,
        dalam_proses_requests: cutiList.filter(cuti => cuti.status === StatusCuti.DALAM_PROSES).length,
        approved_requests: cutiList.filter(cuti => cuti.status === StatusCuti.DISETUJUI).length,
        total_days_taken: kuotaList?.reduce((total: number, kuota: any) => total + (kuota.jatah_total - kuota.jatah_terpakai), 0),
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {user.nama}!</h1>
                        <p className="text-gray-600">
                            {user.jabatan} • {user.lembaga.nama}
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
                            value={userStats.dalam_proses_requests}
                            description="Sedang diproses"
                            icon={FileText}
                        />
                        <StatsCard
                            title="Disetujui"
                            value={userStats.approved_requests}
                            description="Tahun ini"
                            icon={CheckCircle}
                        />
                        <StatsCard
                            title="Total Hari Cuti"
                            value={userStats.total_days_taken}
                            description="Tahun ini"
                            icon={Calendar}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Leave Requests */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Pengajuan Cuti Terbaru</CardTitle>
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
                                    {recentCuti.length > 0 ? (
                                        recentCuti.map((cuti) => (
                                            <div key={cuti.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{cuti.jenisCuti.nama_izin}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(cuti.tanggal_mulai).toLocaleDateString("id-ID")} -{" "}
                                                        {new Date(cuti.tanggal_selesai).toLocaleDateString("id-ID")}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{
                                                        new Date(cuti.tanggal_mulai).toLocaleDateString("id-ID") ===
                                                            new Date(cuti.tanggal_selesai).toLocaleDateString("id-ID")
                                                            ? "1 hari"
                                                            : `${Math.ceil(
                                                                (new Date(cuti.tanggal_selesai).getTime() -
                                                                    new Date(cuti.tanggal_mulai).getTime()) /
                                                                (1000 * 3600 * 24)
                                                            )} hari`
                                                    }</p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        cuti.status === StatusCuti.DISETUJUI
                                                            ? "default"
                                                            : cuti.status === StatusCuti.DITOLAK
                                                                ? "destructive"
                                                                : cuti.status === StatusCuti.DALAM_PROSES
                                                                    ? "secondary"
                                                                    : "outline"
                                                    }
                                                >
                                                    {cuti.status === StatusCuti.DISETUJUI
                                                        ? "Disetujui"
                                                        : cuti.status === StatusCuti.DITOLAK
                                                            ? "Ditolak"
                                                            : cuti.status === StatusCuti.DALAM_PROSES
                                                                ? "Dalam Proses"
                                                                : "Pending"}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Belum ada pengajuan cuti</p>
                                    )}
                                </div>
                                {cutiList.length > 5 && (
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
                                <CardTitle>Sisa Kuota Cuti</CardTitle>
                                <CardDescription>Kuota cuti Anda tahun ini</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {kuotaList.length > 0 ? (
                                        kuotaList.map((kuota) => (
                                            <div key={kuota.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{kuota.jenisCuti.nama_izin}</p>
                                                    <p className="text-sm text-gray-600">Kuota tahunan</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg">{kuota.jatah_total - kuota.jatah_terpakai == 0 ? "Habis" : kuota.jatah_total - kuota.jatah_terpakai}</p>
                                                    <p className="text-sm text-gray-500">dari {kuota.jatah_total} hari</p>
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
