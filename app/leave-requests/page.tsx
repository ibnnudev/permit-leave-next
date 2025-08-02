import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { getEmployeeByUserId, getLeaveRequests } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Clock } from "lucide-react"
import Link from "next/link"

export default async function LeaveRequestsPage() {
    const user = await requireAuth()

    if (user.role !== "employee") {
        redirect("/admin/dashboard")
    }

    const employee = await getEmployeeByUserId(user.id)
    if (!employee) {
        redirect("/login")
    }

    const leaveRequests = await getLeaveRequests(employee.id)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Leave Requests</h1>
                            <p className="text-gray-600">View and manage your leave applications</p>
                        </div>
                        <Button asChild>
                            <Link href="/leave-requests/new">
                                <Plus className="h-4 w-4 mr-2" />
                                New Request
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Leave Request History</CardTitle>
                            <CardDescription>All your submitted leave requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {leaveRequests.length > 0 ? (
                                    leaveRequests.map((request) => (
                                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <Calendar className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{request.leave_type_name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                                                        {new Date(request.end_date).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{request.days_requested} days</p>
                                                    {request.reason && <p className="text-sm text-gray-500 mt-1">Reason: {request.reason}</p>}
                                                    {request.admin_comments && (
                                                        <p className="text-sm text-gray-500 mt-1">Admin Comments: {request.admin_comments}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
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
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(request.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No leave requests found</p>
                                        <Button asChild className="mt-4">
                                            <Link href="/leave-requests/new">Submit Your First Request</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
