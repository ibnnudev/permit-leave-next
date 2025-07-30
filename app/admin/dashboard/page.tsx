import { requireRole } from "@/lib/auth"
import { getAllEmployee, getLeaveQuotaByEmployeeId } from "@/service/employee"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, CheckCircle, XCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { Role, LeaveStatus } from "@prisma/client"
import { getLeaveByApprover, getTotalLeavePerStatusViaFlow } from "@/service/leave"

export default async function AdminDashboard() {
    const user = await requireRole([Role.ADMIN, Role.SUPERADMIN]);

    const [stats, recentRequests, employees, approverStats] = await Promise.all([getLeaveQuotaByEmployeeId(user.id), getLeaveByApprover(user.id), getAllEmployee(user.institution_id), getTotalLeavePerStatusViaFlow(user.id)]);

    const recentRequestsLimited = recentRequests.slice(0, 8)
    const pendingRequests = recentRequests.filter((req: any) => req.status === LeaveStatus.PENDING)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">{user.role == Role.SUPERADMIN ? "Superadmin" : "Admin"} Dashboard</h1>
                        <p className="text-gray-600">Manage employees and leave requests</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <StatsCard title="Total Employees" value={employees.length} description="Active employees" icon={Users} />
                        <StatsCard
                            title="Awaiting Your Approval"
                            value={approverStats.find((s: any) => s.status === LeaveStatus.PENDING)?.total || 0}
                            description="Total requests awaiting your approval"
                            icon={Clock}
                        />
                        <StatsCard
                            title="Approved Requests"
                            value={approverStats.find((s: any) => s.status === LeaveStatus.APPROVED)?.total || 0}
                            description="Total requests approved this year"
                            icon={CheckCircle}
                        />
                        <StatsCard
                            title="Rejected Requests"
                            value={approverStats.find((s: any) => s.status === LeaveStatus.REJECTED)?.total || 0}
                            description="Total requests rejected"
                            icon={XCircle}
                        />
                        <StatsCard
                            title="Total Days Approved"
                            value={approverStats.reduce((sum: number, s: any) => sum + (s.total || 0), 0)}
                            description="Total days of leave approved this year"
                            icon={Calendar}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Leave Requests */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Recent Leave Requests</CardTitle>
                                    <CardDescription>Latest employee leave applications</CardDescription>
                                </div>
                                <Button asChild size="sm">
                                    <Link href="/admin/leave-requests">View All</Link>
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
                                                                ? "default"
                                                                : request.status === LeaveStatus.REJECTED
                                                                    ? "destructive"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {request.status === LeaveStatus.APPROVED
                                                            ? "Approved"
                                                            : request.status === LeaveStatus.REJECTED
                                                                ? "Rejected"
                                                                : "Pending"}
                                                    </Badge>
                                                    <p className="text-sm text-gray-500 mt-1">{request.leaveType.max_days} days</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No leave requests yet</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Approvals */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Pending Approvals</CardTitle>
                                    <CardDescription>Requests requiring your attention</CardDescription>
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
                                                        {request.leaveType.max_days} days • {new Date(request.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button size="sm" asChild>
                                                    <Link href={`/admin/leave-requests/${request.id}`}>Review</Link>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No pending requests</p>
                                    )}
                                </div>
                                {pendingRequests.length > 5 && (
                                    <div className="mt-4 text-center">
                                        <Button variant="outline" asChild>
                                            <Link href="/admin/leave-requests?status=pending">View All Pending</Link>
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
