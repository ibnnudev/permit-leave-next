"use client";

import { Institution } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTransition } from "react";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(1, { message: "Nama wajib diisi" }),
    address: z.string().optional(),
    phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditInstitutionModalProps {
    open: boolean;
    onClose: () => void;
    institution: Institution;
}

export function EditInstitutionModal({ open, onClose, institution }: EditInstitutionModalProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: institution.name ?? "",
            address: institution.address ?? "",
            phone: institution.phone ?? "",
        },
    });

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                const response = await fetch(`/api/institutions/${institution.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.error || "Gagal memperbarui institusi");
                }

                onClose();
                toast.success("Institusi berhasil diperbarui");
                form.reset(data);
            } catch (error) {
                console.error("Error updating institution:", error);
                toast.error("Gagal memperbarui institusi", {
                    description: error instanceof Error ? error.message : String(error),
                });
            }
        });
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Institusi</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telepon</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                Simpan
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
