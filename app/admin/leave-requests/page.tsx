"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/auth"
import type { LeaveRequest } from "@/lib/db"

interface AdminLeaveRequestsProps {
    user: User
}

export default function AdminLeaveRequestsPage() {
    const [user, setUser] = useState<User | null>(null)
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch("/api/leave-requests")
            if (response.ok) {
                const data = await response.json()
                setLeaveRequests(data)
            }
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch leave requests:", error)
            setLoading(false)
        }
    }

    const pendingRequests = leaveRequests.filter((req) => req.status === "pending")
    const approvedRequests = leaveRequests.filter((req) => req.status === "approved")
    const rejectedRequests = leaveRequests.filter((req) => req.status === "rejected")

    const RequestCard = ({ request }: { request: LeaveRequest }) => (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">{request.employee_name}</h3>
                    <p className="text-sm text-gray-600">{request.leave_type_name}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{request.days_requested} days</p>
                    {request.reason && <p className="text-sm text-gray-500 mt-1">Reason: {request.reason}</p>}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <Badge
                        variant={
                            request.status === "approved" ? "default" : request.status === "rejected" ? "destructive" : "secondary"
                        }
                    >
                        {request.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">{new Date(request.created_at).toLocaleDateString()}</p>
                </div>
                {request.status === "pending" && (
                    <Button size="sm" asChild>
                        <Link href={`/admin/leave-requests/${request.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Leave Request Management</h1>
                        <p className="text-gray-600">Review and manage employee leave requests</p>
                    </div>

                    <Tabs defaultValue="pending" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all" className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>All ({leaveRequests.length})</span>
                            </TabsTrigger>
                            <TabsTrigger value="pending" className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>Pending ({pendingRequests.length})</span>
                            </TabsTrigger>
                            <TabsTrigger value="approved" className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Approved ({approvedRequests.length})</span>
                            </TabsTrigger>
                            <TabsTrigger value="rejected" className="flex items-center space-x-2">
                                <XCircle className="h-4 w-4" />
                                <span>Rejected ({rejectedRequests.length})</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <Card>
                                <CardHeader>
                                    <CardTitle>All Leave Requests</CardTitle>
                                    <CardDescription>Complete list of all leave requests</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {leaveRequests.map((request) => (
                                            <RequestCard key={request.id} request={request} />
                                        ))}
                                        {leaveRequests.length === 0 && (
                                            <div className="text-center py-8">
                                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No leave requests found</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="pending">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending Requests</CardTitle>
                                    <CardDescription>Requests awaiting your review</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {pendingRequests.map((request) => (
                                            <RequestCard key={request.id} request={request} />
                                        ))}
                                        {pendingRequests.length === 0 && (
                                            <div className="text-center py-8">
                                                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No pending requests</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="approved">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Approved Requests</CardTitle>
                                    <CardDescription>Successfully approved leave requests</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {approvedRequests.map((request) => (
                                            <RequestCard key={request.id} request={request} />
                                        ))}
                                        {approvedRequests.length === 0 && (
                                            <div className="text-center py-8">
                                                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No approved requests</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="rejected">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rejected Requests</CardTitle>
                                    <CardDescription>Declined leave requests</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {rejectedRequests.map((request) => (
                                            <RequestCard key={request.id} request={request} />
                                        ))}
                                        {rejectedRequests.length === 0 && (
                                            <div className="text-center py-8">
                                                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No rejected requests</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
