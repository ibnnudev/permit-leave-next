// @/app/employees/page.tsx
import { requireRole } from "@/lib/auth";
import { getAllEmployee } from "@/service/employee";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Role } from "@prisma/client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function EmployeesPage() {
    const user = await requireRole([Role.SUPERADMIN, Role.ADMIN]);
    const employees = await getAllEmployee();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Data Karyawan</h1>
                        <p className="text-gray-600">Lihat & kelola semua karyawan yang terdaftar</p>
                    </div>

                    {employees.length > 0 ? (
                        <DataTable columns={columns} data={employees} filterColumn="name" />
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
    );
}