"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Calendar, User, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import type { LeaveRequest } from "@/lib/db"

export default function LeaveRequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [request, setRequest] = useState<LeaveRequest | null>(null)
  const [adminComments, setAdminComments] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchRequest()
  }, [params.id])

  const fetchRequest = async () => {
    try {
      const response = await fetch(`/api/leave-requests/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setRequest(data)
        setAdminComments(data.admin_comments || "")
      } else {
        setError("Failed to fetch leave request")
      }
    } catch (error) {
      setError("An error occurred while fetching the request")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    if (!request) return

    setProcessing(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/leave-requests/${request.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          admin_comments: adminComments,
        }),
      })

      if (response.ok) {
        setSuccess(`Leave request ${status} successfully!`)
        setTimeout(() => {
          router.push("/admin/leave-requests")
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || `Failed to ${status} request`)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Leave request not found</p>
            <Button asChild className="mt-4">
              <Link href="/admin/leave-requests">Back to Leave Requests</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/admin/leave-requests"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leave Requests
            </Link>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Leave Request Details</CardTitle>
                    <CardDescription>Review and manage this leave request</CardDescription>
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
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Employee</p>
                        <p className="text-sm text-gray-600">{request.employee_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Leave Type</p>
                        <p className="text-sm text-gray-600">{request.leave_type_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Duration</p>
                        <p className="text-sm text-gray-600">{request.days_requested} days</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Start Date</p>
                      <p className="text-sm text-gray-600">{new Date(request.start_date).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">End Date</p>
                      <p className="text-sm text-gray-600">{new Date(request.end_date).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">Submitted</p>
                      <p className="text-sm text-gray-600">{new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {request.reason && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Reason</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{request.reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {request.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Request</CardTitle>
                  <CardDescription>Approve or reject this leave request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="admin_comments">Admin Comments (Optional)</Label>
                    <Textarea
                      id="admin_comments"
                      placeholder="Add any comments about this decision..."
                      value={adminComments}
                      onChange={(e) => setAdminComments(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={() => handleStatusUpdate("approved")} disabled={processing} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {processing ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate("rejected")}
                      disabled={processing}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {processing ? "Processing..." : "Reject"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {request.status !== "pending" && request.admin_comments && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{request.admin_comments}</p>
                  {request.approved_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Decision made on {new Date(request.approved_at).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
