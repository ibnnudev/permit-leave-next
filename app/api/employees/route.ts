import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRoleForApi } from "@/lib/auth";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { buildApiQuery } from "@/lib/queryBuilder";
import { formatApiResponse, handleError } from "@/lib/formatApiRes";
import { Role } from "@prisma/client";
import { employeeFormSchema } from "@/lib/validations/employees";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
    try {
        await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN]);
        const { filter, page, limit, search, order_by, sorted_by, withParams } =
            parseQueryParams(req.url);
        const totalItems = await prisma.employee.count();
        const paginationParams = { page, limit };

        const query = buildApiQuery({
            filter,
            search,
            order_by,
            sorted_by,
            pagination: paginationParams,
            with: withParams,
        });

        const employees = await prisma.employee.findMany(query as any);
        const pagination = {
            total: totalItems,
            per_page: limit,
            current_page: page,
            last_page: Math.ceil(totalItems / limit),
        };
        const response = formatApiResponse(employees, pagination);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = employeeFormSchema.parse(body);

        const employee = await prisma.employee.create({
            data: {
                institution_id: data.institution_id,
                name: data.name,
                gender: data.gender,
                position: data.position,
                whatsapp_number: data.whatsapp_number,
                address: data.address,
                birth_place: data.birth_place,
                birth_date: new Date(data.birth_date),
                join_date: new Date(), // Assuming join_date is the same as birth_date for simplicity
                marital_status: data.marital_status,
                employment_status: data.employment_status,
                personal_email: data.personal_email,
                institution_email: data.institution_email,
                religion: data.religion,
                last_education: data.last_education,
                password: bcrypt.hashSync("password", 10),
                role: data.role ?? Role.EMPLOYEE,
            },
        });

        const response = formatApiResponse(
            employee,
            undefined,
            true,
            "Employee created successfully"
        );
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

