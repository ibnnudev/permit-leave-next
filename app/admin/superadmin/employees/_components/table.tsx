"use client"

import { DataTable } from "@/components/ui/data-table"
import { Employee } from "@prisma/client"
import { toast } from "sonner"
import { columns } from "../columns"
import { CreateForm } from "./create-form"

export function TableClient({ data }: { data: Employee[] }) {
    return (
        <DataTable
            columns={columns}
            data={data}
            filterColumn="name"
            addButtonText="Tambah Karyawan"
            formContent={<CreateForm />}
        />
    )
}
