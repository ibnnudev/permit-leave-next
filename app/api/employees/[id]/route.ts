import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { requireRoleForApi } from "@/lib/auth";
import { handleError, formatApiResponse } from "@/lib/formatApiRes";
import bcrypt from "bcryptjs";

// Schema yang sama seperti saat create
const employeeFormSchema = z.object({
    institution_id: z.number(),
    name: z.string(),
    gender: z.string(),
    position: z.string(),
    whatsapp_number: z.string(),
    address: z.string(),
    birth_place: z.string(),
    birth_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid birth_date",
    }),
    join_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid join_date",
    }),
    marital_status: z.string(),
    employment_status: z.string(),
    personal_email: z.string().email(),
    institution_email: z.string().email(),
    religion: z.string(),
    last_education: z.string(),
    password: z.string().optional(), // optional saat update
    role: z.nativeEnum(Role).optional(),
});

// ========================
// GET - Get employee by ID
// ========================
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN]);
        const id = parseInt(params.id);
        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee) {
            return NextResponse.json(
                { success: false, message: "Employee not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(formatApiResponse(employee));
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

// ========================
// PUT - Update employee
// ========================
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN]);
        const id = parseInt(params.id);
        const body = await req.json();
        const data = employeeFormSchema.parse(body);

        const updateData: any = {
            institution_id: data.institution_id,
            name: data.name,
            gender: data.gender,
            position: data.position,
            whatsapp_number: data.whatsapp_number,
            address: data.address,
            birth_place: data.birth_place,
            birth_date: new Date(data.birth_date),
            join_date: new Date(data.join_date),
            marital_status: data.marital_status,
            employment_status: data.employment_status,
            personal_email: data.personal_email,
            institution_email: data.institution_email,
            religion: data.religion,
            last_education: data.last_education,
            role: data.role ?? Role.EMPLOYEE,
        };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const employee = await prisma.employee.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(
            formatApiResponse(employee, undefined, true, "Employee updated successfully")
        );
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

// ========================
// DELETE - Delete employee
// ========================
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN]);
        const id = parseInt(params.id);

        await prisma.employee.delete({ where: { id } });

        return NextResponse.json(
            formatApiResponse(null, undefined, true, "Employee deleted successfully")
        );
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}
