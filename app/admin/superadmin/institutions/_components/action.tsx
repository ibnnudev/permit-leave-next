"use client";

import { useState } from "react";
import { Institution } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { EditInstitutionModal } from "../_components/edit-form";
import { DeleteInstitutionModal } from "../_components/delete-modal";

export function InstitutionActions({ institution }: { institution: Institution }) {
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
                    <DropdownMenuItem>
                        <Link href={`/admin/superadmin/institution/${institution.id}`}>
                            Lihat Detail
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditInstitutionModal open={openEdit} onClose={() => setOpenEdit(false)} institution={institution} />
            <DeleteInstitutionModal open={openDelete} onClose={() => setOpenDelete(false)} institution={institution} />
        </>
    );
}
