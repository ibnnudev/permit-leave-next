import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    try {
        const institution = await prisma.institution.delete({
            where: { id },
        });

        return NextResponse.json(institution, { status: 200 });
    } catch (error) {
        console.error("Gagal menghapus institusi:", error);
        return NextResponse.json({ error: "Gagal menghapus institusi" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    if (isNaN(id)) {
        return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const data = await req.json();
    const { name, address, phone } = data;

    if (!name) {
        return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    try {
        const institution = await prisma.institution.update({
            where: { id },
            data: {
                name,
                address,
                phone,
            },
        });

        return NextResponse.json(institution, { status: 200 });
    } catch (error) {
        console.error("Gagal memperbarui institusi:", error);
        return NextResponse.json({ error: "Gagal memperbarui institusi" }, { status: 500 });
    }
}
