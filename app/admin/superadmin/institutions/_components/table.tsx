"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "../columns"
import { CreateForm } from "./create-form"
import { Institution } from "@prisma/client"
import { Employee } from "@prisma/client"
import { toast } from "sonner"

interface InstitutionWithEmployees extends Institution {
    employees: Employee[]
}

export function InstitutionTableClient({ data }: { data: InstitutionWithEmployees[] }) {
    const handleSubmit = async (values: {
        name: string
        address: string
        phone: string
    }) => {
        try {
            const res = await fetch("/api/institutions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!res.ok) throw new Error("Gagal menyimpan data")
            toast.success("Data lembaga berhasil ditambahkan")
        } catch (err) {
            toast.error("Gagal menambahkan lembaga")
            console.error("Error adding institution:", err)
        }
    }

    return (
        <DataTable
            columns={columns}
            data={data}
            filterColumn="name"
            addButtonText="Tambah Institusi"
            formContent={<CreateForm onSubmit={handleSubmit} />}
        />
    )
}
