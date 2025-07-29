import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { getEmployeeByUserId, getLeaveStats, getLeaveRequests } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, XCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EmployeeDashboard() {
  const user = await requireAuth()

  if (user.role !== "employee") {
    redirect("/admin/dashboard")
  }

  const employee = await getEmployeeByUserId(user.id)
  if (!employee) {
    redirect("/login")
  }

  const stats = await getLeaveStats(employee.id)
  const recentRequests = await getLeaveRequests(employee.id)
  const recentRequestsLimited = recentRequests.slice(0, 5)

  const remainingAnnualLeave = employee.annual_leave_days - (stats.total_days_taken || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {employee.first_name}!</h1>
            <p className="text-gray-600">
              {employee.position} • {employee.department}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Remaining Annual Leave"
              value={remainingAnnualLeave}
              description="Days available"
              icon={Calendar}
            />
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
            <StatsCard title="Days Taken" value={stats.total_days_taken || 0} description="This year" icon={XCircle} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Leave Requests */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Leave Requests</CardTitle>
                  <CardDescription>Your latest leave applications</CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href="/leave-requests/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequestsLimited.length > 0 ? (
                    recentRequestsLimited.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{request.leave_type_name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(request.start_date).toLocaleDateString()} -{" "}
                            {new Date(request.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">{request.days_requested} days</p>
                        </div>
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
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No leave requests yet</p>
                  )}
                </div>
                {recentRequests.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/leave-requests">View All Requests</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leave Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Balance</CardTitle>
                <CardDescription>Your current leave entitlements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Annual Leave</p>
                      <p className="text-sm text-gray-600">Yearly vacation days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{remainingAnnualLeave}</p>
                      <p className="text-sm text-gray-500">of {employee.annual_leave_days} days</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sick Leave</p>
                      <p className="text-sm text-gray-600">Medical leave days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{employee.sick_leave_days}</p>
                      <p className="text-sm text-gray-500">available</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
