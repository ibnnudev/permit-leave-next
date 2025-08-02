"use client"

import { DataTable } from "@/components/ui/data-table"
import { Employee } from "@prisma/client"
import { toast } from "sonner"
import { columns } from "../columns"
import { CreateForm } from "./create-form"

export function TableClient({ data }: { data: Employee[] }) {
    const handleSubmit = async (values: any) => {
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
            addButtonText="Tambah Karyawan"
            formContent={<CreateForm onSubmit={handleSubmit} />}
        />
    )
}
