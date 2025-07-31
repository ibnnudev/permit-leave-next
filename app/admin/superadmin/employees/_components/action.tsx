"use client";

import { useState } from "react";
import { Employee, Institution } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { EditModal } from "./edit-form";
import { DeleteModal } from "./delete-modal";

export function ActionColumn({ data }: { data: Employee }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenDelete(true)}>Hapus</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


            <EditModal open={openEdit} onClose={() => setOpenEdit(false)} data={data} />
            <DeleteModal open={openDelete} onClose={() => setOpenDelete(false)} data={data} />
        </>
    );
}
