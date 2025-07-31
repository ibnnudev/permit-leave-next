"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Employee, Institution } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/ui/sortable-ui";
import { formatDate } from "@/lib/utils";
import { InstitutionActions } from "./_components/action";

interface InstitutionWithEmployees extends Institution {
    employees: Employee[];
}

export const columns: ColumnDef<InstitutionWithEmployees>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} label="Nama" />,
    },
    {
        accessorKey: "employeeCount",
        header: "Jumlah Karyawan",
        cell: ({ row }) => {
            const count = row.original.employees.length;
            return <Badge variant="outline">{count ?? 0} Karyawan</Badge>;
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => <SortableHeader column={column} label="Gabung Sejak" />,
        cell: ({ row }) => {
            const date = row.getValue("created_at");
            return <div>{formatDate(date as string | Date)}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <InstitutionActions institution={row.original} />,
    },
];
