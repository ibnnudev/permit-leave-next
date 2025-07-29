"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface LeaveType {
  id: number
  name: string
  description: string
  max_days_per_year: number
}

export default function NewLeaveRequestPage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch("/api/leave-types")
      if (response.ok) {
        const data = await response.json()
        setLeaveTypes(data)
      }
    } catch (error) {
      console.error("Failed to fetch leave types:", error)
    }
  }

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const days_requested = calculateDays(formData.start_date, formData.end_date)

    if (days_requested <= 0) {
      setError("Please select valid dates")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          leave_type_id: Number.parseInt(formData.leave_type_id),
          days_requested,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Leave request submitted successfully!")
        setTimeout(() => {
          router.push("/leave-requests")
        }, 2000)
      } else {
        setError(data.error || "Failed to submit leave request")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const daysRequested = calculateDays(formData.start_date, formData.end_date)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/leave-requests" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leave Requests
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Leave</CardTitle>
            <CardDescription>Submit a new leave request for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="leave_type_id">Leave Type</Label>
                <Select
                  value={formData.leave_type_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, leave_type_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                    required
                    min={formData.start_date || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {daysRequested > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Days requested:</strong> {daysRequested} day{daysRequested !== 1 ? "s" : ""}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for your leave request"
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  required
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/leave-requests">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
