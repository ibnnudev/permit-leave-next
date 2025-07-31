"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@prisma/client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { id } from "zod/v4/locales";

const formSchema = z.object({
    id: z.number().int().positive({ message: "ID harus berupa angka positif" }),
    name: z.string().min(1, { message: "Nama wajib diisi" }),
    gender: z.string().min(1, { message: "Jenis kelamin wajib diisi" }),
    position: z.string().min(1, { message: "Jabatan wajib diisi" }),
    whastapp_number: z.string().min(1, { message: "Nomor WhatsApp wajib diisi" }),
    address: z.string().min(1, { message: "Alamat wajib diisi" }),
    birth_place: z.string().min(1, { message: "Tempat lahir wajib diisi" }),
    birth_date: z.string().min(1, { message: "Tanggal lahir wajib diisi" }).refine((val) => !isNaN(Date.parse(val)), {
        message: "Tanggal lahir tidak valid",
    }),
    marital_status: z.string().min(1, { message: "Status pernikahan wajib diisi" }),
    employment_status: z.string().min(1, { message: "Status kepegawaian wajib diisi" }),
    personal_email: z.string().email({ message: "Email tidak valid" }),
    institution_email: z.string().email({ message: "Email tidak valid" }),
    religion: z.string().min(1, { message: "Agama wajib diisi" }),
    last_education: z.string().min(1, { message: "Pendidikan terakhir wajib diisi" }),
    role: z.string().min(1, { message: "Peran wajib diisi" }),
});

type FormData = z.infer<typeof formSchema>;

interface EditModalProps {
    open: boolean;
    onClose: () => void;
    data: Employee;
}

export function EditModal({ open, onClose, data }: EditModalProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            gender: data.gender,
            position: data.position,
            whastapp_number: data.whatsapp_number,
            address: data.address,
            birth_place: data.birth_place,
            birth_date: typeof data.birth_date === "string" ? data.birth_date : data.birth_date?.toISOString().slice(0, 10) || "",
            marital_status: data.marital_status,
            employment_status: data.employment_status,
            personal_email: data.personal_email,
            institution_email: data.institution_email,
            religion: data.religion,
            last_education: data.last_education,
            role: data.role,
        },
    });

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                const response = await fetch(`/api/datas/${data.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.error || "Gagal memperbarui institusi");
                }

                onClose();
                toast.success("Karyawan berhasil diperbarui");
                form.reset(data);
            } catch (error) {
                console.error("Error updating data:", error);
                toast.error("Gagal memperbarui institusi", {
                    description: error instanceof Error ? error.message : String(error),
                });
            }
        });
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Karyawan</DialogTitle>
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
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenis Kelamin</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Male">Laki-laki</SelectItem>
                                            <SelectItem value="Female">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="whastapp_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nomor WhatsApp</FormLabel>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="birth_place"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tempat Lahir</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="birth_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal Lahir</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="marital_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status Pernikahan</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="employment_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status Kepegawaian</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="personal_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Pribadi</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="institution_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Karyawan</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="religion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agama</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="last_education"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pendidikan Terakhir</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Peran</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
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
