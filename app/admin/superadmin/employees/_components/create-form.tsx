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
    FormDescription,
} from "@/components/ui/form"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Institution, Role } from "@prisma/client"
import { employeeFormSchema } from "@/lib/validations/employees"
import { useQuery } from "@/hooks/useQuery"

type CreateFormValues = z.infer<typeof employeeFormSchema>

interface CreateFormProps {
    onClose?: () => void
}

export function CreateForm({ onClose }: CreateFormProps) {
    // const { institution } = useQuery<Institution>("institutions?with=pagination=false", "");

    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            name: "",
            institution_id: 0,
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
            role: Role.EMPLOYEE,
        },
    })

    const handleSubmit = (values: CreateFormValues) => {
        startTransition(async () => {
            try {
                const res = await fetch("/api/employees", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                })

                console.log("Response status:", res.status);

                if (!res.ok) throw new Error("Gagal menyimpan data")
                toast.success("Data karyawan berhasil ditambahkan")
                form.reset()
                onClose?.()
            } catch (err) {
                toast.error("Gagal menambahkan karyawan")
                console.error("Error adding employee:", err)
            }
        })
    }

    console.log(form.formState.errors)
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {/* <FormField
                    control={form.control}
                    name="instition_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jenis Kelamin</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Laki-laki</SelectItem>
                                    <SelectItem value="Female">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

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
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                </SelectTrigger>
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

                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status Pernikahan" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Single">Belum Menikah</SelectItem>
                                    <SelectItem value="Married">Menikah</SelectItem>
                                    <SelectItem value="Divorced">Cerai</SelectItem>
                                </SelectContent>
                            </Select>
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
                            {/* pns, kontrak, honorer */}
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status Kepegawaian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PNS">PNS</SelectItem>
                                    <SelectItem value="Kontrak">Kontrak</SelectItem>
                                    <SelectItem value="Honorer">Honorer</SelectItem>
                                </SelectContent>
                            </Select>
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
                            <FormDescription>
                                Contoh: karyawan@nchmerdeka.com
                            </FormDescription>
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
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Agama" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Islam">Islam</SelectItem>
                                    <SelectItem value="Kristen">Kristen</SelectItem>
                                    <SelectItem value="Katolik">Katolik</SelectItem>
                                    <SelectItem value="Hindu">Hindu</SelectItem>
                                    <SelectItem value="Buddha">Buddha</SelectItem>
                                    <SelectItem value="Konghucu">Konghucu</SelectItem>
                                </SelectContent>
                            </Select>
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
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Pendidikan Terakhir" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SD">SD</SelectItem>
                                    <SelectItem value="SMP">SMP</SelectItem>
                                    <SelectItem value="SMA">SMA</SelectItem>
                                    <SelectItem value="D3">D3</SelectItem>
                                    <SelectItem value="S1">S1</SelectItem>
                                    <SelectItem value="S2">S2</SelectItem>
                                    <SelectItem value="S3">S3</SelectItem>
                                </SelectContent>
                            </Select>
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
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={Role.EMPLOYEE}>Karyawan</SelectItem>
                                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                    {/* <SelectItem value={Role.SUPERADMIN}>Superadmin</SelectItem> */}
                                </SelectContent>
                            </Select>
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
