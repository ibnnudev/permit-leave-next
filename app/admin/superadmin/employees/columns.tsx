"use client";

import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/ui/sortable-ui";
import { formatDate } from "@/lib/utils";
import { Employee, Institution } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ActionColumn } from "./_components/action";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} label="Nama" />,
        cell: ({ row }) => {
            return (
                <div className="lg:flex items-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{row?.original?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                        <div className="font-medium">{row.getValue("name")}</div>
                        <div className="text-sm text-gray-500">{row?.original?.personal_email || "Tidak ada email"}</div>
                        <div className="text-sm text-gray-500">
                            {row?.original?.whatsapp_number || "Tidak ada nomor telepon"}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "position",
        header: ({ column }) => <SortableHeader column={column} label="Jabatan" />,
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
        cell: ({ row }) => <ActionColumn data={row.original} />,
    },
];
