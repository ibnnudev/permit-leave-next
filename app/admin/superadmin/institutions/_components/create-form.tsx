"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
    name: z.string().min(1, "Nama tidak boleh kosong"),
    address: z.string().min(1, "Alamat tidak boleh kosong"),
    phone: z.string().min(8, "Telepon tidak valid"),
})

type CreateFormValues = z.infer<typeof formSchema>

interface CreateFormProps {
    onSubmit?: (values: CreateFormValues) => void
}

export function CreateForm({ onSubmit }: CreateFormProps) {
    const form = useForm<CreateFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            address: "",
            phone: "",
        },
    })

    const handleSubmit = (values: CreateFormValues) => {
        onSubmit?.(values)
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Institusi</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: SMK Negeri 1" {...field} />
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
                                <Input placeholder="Contoh: Jl. Merdeka No. 12" {...field} />
                            </FormControl>
                            <FormMessage />
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
                                <Input placeholder="Contoh: 08123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Simpan</Button>
                </div>
            </form>
        </Form>
    )
}
