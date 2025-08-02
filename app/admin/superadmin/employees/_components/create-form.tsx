"use client"

import { useTransition } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

const formSchema = z.object({
    name: z.string().min(1, { message: "Nama wajib diisi" }),
    gender: z.string().min(1, { message: "Jenis kelamin wajib diisi" }),
    position: z.string().min(1, { message: "Jabatan wajib diisi" }),
    whatsapp_number: z.string().min(1, { message: "Nomor WhatsApp wajib diisi" }),
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
})

type CreateFormValues = z.infer<typeof formSchema>

interface CreateFormProps {
    onSubmit?: (values: CreateFormValues) => Promise<void> | void
    onClose?: () => void
}

export function CreateForm({ onSubmit, onClose }: CreateFormProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            gender: "",
            position: "",
            whatsapp_number: "",
            address: "",
            birth_place: "",
            birth_date: "",
            marital_status: "",
            employment_status: "",
            personal_email: "",
            institution_email: "",
            religion: "",
            last_education: "",
            role: "",
        },
    })

    const handleSubmit = (values: CreateFormValues) => {
        startTransition(async () => {
            try {
                if (onSubmit) await onSubmit(values)
                toast.success("Data karyawan berhasil disimpan")
                form.reset()
                onClose?.()
            } catch (error) {
                console.error(error)
                toast.error("Gagal menyimpan data", {
                    description: error instanceof Error ? error.message : String(error),
                })
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

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
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jabatan</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="whatsapp_number"
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
                    {onClose && (
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Batal
                        </Button>
                    )}
                    <Button type="submit" disabled={isPending}>
                        Simpan
                    </Button>
                </div>
            </form>
        </Form>
    )
}
