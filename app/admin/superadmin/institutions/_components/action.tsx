"use client";

import { useState } from "react";
import { Institution } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash, Users } from "lucide-react";
import { EditInstitutionModal } from "../_components/edit-form";
import { DeleteInstitutionModal } from "../_components/delete-modal";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function InstitutionActions({ institution }: { institution: Institution }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    return (
        <>
            {/* <DropdownMenu>
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
            </DropdownMenu> */}

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="mr-2 rounded-full">
                            <Users className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Manage Karyawan</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setOpenEdit(true)}
                            className="mr-2 rounded-full"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setOpenDelete(true)}
                            className="rounded-full"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete</p>
                    </TooltipContent>
                </Tooltip>

            </TooltipProvider>

            <EditInstitutionModal open={openEdit} onClose={() => setOpenEdit(false)} institution={institution} />
            <DeleteInstitutionModal open={openDelete} onClose={() => setOpenDelete(false)} institution={institution} />
        </>
    );
}
