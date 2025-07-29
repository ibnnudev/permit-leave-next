"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2 } from "lucide-react"

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                // Redirect based on user role
                if (data.user.role === "superadmin") {
                    router.push("/superadmin/dashboard")
                } else if (data.user.role === "admin") {
                    router.push("/admin/dashboard")
                } else {
                    router.push("/dashboard")
                }
            } else {
                setError(data.error || "Login failed")
            }
        } catch (error) {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    {/* <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div> */}
                    <CardTitle className="text-2xl font-bold">Sistem Manajemen Cuti</CardTitle>
                    <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@perusahaan.com"
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Masuk...
                                </>
                            ) : (
                                "Masuk"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p className="mb-2">Demo Akun:</p>
                        <div className="space-y-1 text-xs">
                            <p>
                                <strong>Superadmin:</strong> superadmin@system.com
                            </p>
                            <p>
                                <strong>Admin:</strong> admin1@teknologi.com
                            </p>
                            <p>
                                <strong>Karyawan:</strong> john@teknologi.com
                            </p>
                            <p className="text-gray-500">Password: password</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
