import prisma from "@/lib/prisma";
import { Employee } from "@prisma/client";

export async function getAllEmployee(institutionId?: number) {
    return prisma.employee.findMany({
        where: institutionId ? { institution_id: institutionId } : undefined,
        include: {
            institution: true,
            leave_quotas: {
                include: {
                    leaveType: true,
                },
            },
        },
    });
}

export async function getEmployeeById(id: number) {
    return prisma.employee.findUnique({
        where: { id },
        include: {
            institution: true,
            leave_quotas: {
                include: {
                    leaveType: true,
                },
            },
        },
    });
}

export async function createEmployee(data: Employee) {
    return prisma.employee.create({
        data,
    });
}

export async function getLeaveQuotaByEmployeeId(
    userId: number,
    year: number = new Date().getFullYear()
) {
    return prisma.leaveQuota.findMany({
        where: { employee_id: userId, year: year },
        include: {
            leaveType: true,
        },
    });
}
