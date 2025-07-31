"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Employee, Institution, Leave, Role } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export const columns: ColumnDef<Employee & {
    institution: Institution,
    approved_leaves: Leave[],
    submitted_leaves: Leave[],
}>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nama
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-gray-500">{employee.personal_email}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "position",
            header: "Jabatan",
            cell: ({ row }) => <div className="capitalize">{row.getValue("position")}</div>,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: "institution.name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Institusi
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div>{row.original.institution.name}</div>,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Gabung Sejak
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"));
                return <div>{date.toLocaleDateString()}</div>;
            },
        },
        {
            id: "leaveTotal",
            header: "Cuti Disetujui",
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <Badge variant="outline">{employee.approved_leaves.length} hari</Badge>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const employee = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <Link href={`/admin/superadmin/employees/${employee.id}/edit`}>
                                    Edit Karyawan
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => console.log(`Deleting employee: ${employee.id}`)}
                            >
                                Hapus
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Lihat detail karyawan</DropdownMenuItem>
                            {/* Add more actions here if needed */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];