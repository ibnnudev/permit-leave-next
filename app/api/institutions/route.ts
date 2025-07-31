// app/api/institutions/route.ts

import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"

const formSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(8),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const data = formSchema.parse(body)

        const institution = await prisma.institution.create({
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
            },
        })

        return NextResponse.json(institution, { status: 201 })
    } catch (error) {
        console.error("Gagal menyimpan data:", error)
        return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 400 })
    }
}