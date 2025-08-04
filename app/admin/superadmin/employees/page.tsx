"use client"

import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Employee } from "@prisma/client"
import { Users } from "lucide-react"
import { TableClient } from "./_components/table"
import { useAuth } from "@/context/auth-context"
import { useQuery } from "@/hooks/useQuery"
import { useState } from "react"

export default function Page() {
    const { user, loading } = useAuth();
    const [page, setPage] = useState(1);
    const { data: employees } = useQuery<PaginationResponse<Employee>>(
        `employees?with=institution&page=${page}`,
        "employees"
    );
    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user as any} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Data Karyawan</h1>
                        <p className="text-gray-600">Lihat & kelola semua karyawan yang terdaftar</p>
                    </div>

                    {employees ? (
                        <TableClient
                            data={employees?.data?.items}
                            pagination={employees?.data?.pagination}
                            onPageChange={setPage}
                        />
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <p className="text-gray-500">Belum ada karyawan yang terdaftar nih</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}