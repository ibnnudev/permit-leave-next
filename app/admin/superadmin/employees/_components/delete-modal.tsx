"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "@prisma/client";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    data: Employee;
}

export const DeleteModal = ({ open, onClose, data }: Props) => {
    const handleDelete = async () => {
        const response = await fetch(`/api/employees/${data.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            let errorMsg = "Gagal menghapus karyawan";
            try {
                const errorData = await response.json();
                errorMsg = errorData?.error || errorMsg;
            } catch {
                console.error("Failed to parse error response");
            }
            throw new Error(errorMsg);
        }

        toast.success("karyawan berhasil dihapus");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus karyawan</DialogTitle>
                </DialogHeader>
                <p>Yakin ingin menghapus <strong>{data.name}</strong>?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
