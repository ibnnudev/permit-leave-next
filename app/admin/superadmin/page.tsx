import { requeireSuperadmin } from "@/lib/auth"
import { getLeaveStats, getLeaveRequests, getAllEmployees } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, CheckCircle, XCircle, Calendar } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
    const user = await requeireSuperadmin()

    const [stats, recentRequests, employees] = await Promise.all([getLeaveStats(), getLeaveRequests(), getAllEmployees()])

    const recentRequestsLimited = recentRequests.slice(0, 8)
    const pendingRequests = recentRequests.filter((req) => req.status === "pending")

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage employees and leave requests</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <StatsCard title="Total Employees" value={employees.length} description="Active employees" icon={Users} />
                        <StatsCard
                            title="Pending Requests"
                            value={stats.pending_requests || 0}
                            description="Awaiting approval"
                            icon={Clock}
                        />
                        <StatsCard
                            title="Approved Requests"
                            value={stats.approved_requests || 0}
                            description="This year"
                            icon={CheckCircle}
                        />
                        <StatsCard
                            title="Rejected Requests"
                            value={stats.rejected_requests || 0}
                            description="This year"
                            icon={XCircle}
                        />
                        <StatsCard
                            title="Total Days Approved"
                            value={stats.total_days_taken || 0}
                            description="This year"
                            icon={Calendar}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Leave Requests */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Leave Requests</CardTitle>
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
                                                    <p className="font-medium">{request.employee_name}</p>
                                                    <p className="text-sm text-gray-600">{request.leave_type_name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                                                        {new Date(request.end_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge
                                                        variant={
                                                            request.status === "approved"
                                                                ? "default"
                                                                : request.status === "rejected"
                                                                    ? "destructive"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {request.status}
                                                    </Badge>
                                                    <p className="text-sm text-gray-500 mt-1">{request.days_requested} days</p>
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
                                    <CardTitle>Pending Approvals</CardTitle>
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
                                                    <p className="font-medium">{request.employee_name}</p>
                                                    <p className="text-sm text-gray-600">{request.leave_type_name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {request.days_requested} days • {new Date(request.created_at).toLocaleDateString()}
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
