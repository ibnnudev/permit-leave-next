import prisma from "@/lib/prisma";
import { Employee, LeaveStatus } from "@prisma/client";

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
            approved_leaves: true,
            submitted_leaves: {
                where: {
                    status: LeaveStatus.APPROVED,
                },
            },
        },
    });
}

export async function getEmployeeLeaveSummary(institutionId?: number) {
    const employees = await getAllEmployee(institutionId);

    return employees.map((employee) => {
        let totalQuotaAllTypes = 0;
        let totalTakenAllTypes = 0;
        const leaveDetails: {
            leaveType: string;
            totalQuota: number;
            taken: number;
            remaining: number;
        }[] = [];

        // Calculate total quota and taken for each leave type
        employee.leave_quotas.forEach((quota) => {
            const takenForType = employee.submitted_leaves.filter(
                (leave) =>
                    leave.leave_type_id === quota.leave_type_id &&
                    leave.status === "APPROVED" // Ensure only approved leaves are counted
            ).length; // You might need to sum up days if your leave object stores duration

            const remaining = quota.total_quota - takenForType;

            totalQuotaAllTypes += quota.total_quota;
            totalTakenAllTypes += takenForType;

            leaveDetails.push({
                leaveType: quota.leaveType.name,
                totalQuota: quota.total_quota,
                taken: takenForType,
                remaining: remaining,
            });
        });

        const totalApprovedLeavesDuration = employee.submitted_leaves.reduce((sum, leave) => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return sum + diffDays;
        }, 0);


        return {
            id: employee.id,
            name: employee.name,
            totalQuotaAllTypes: totalQuotaAllTypes,
            totalTakenAllTypes: totalApprovedLeavesDuration,
            totalRemainingAllTypes: totalQuotaAllTypes - totalApprovedLeavesDuration,
            leaveDetails: leaveDetails,
        };
    });
}

// The other functions (getEmployeeById, createEmployee, getLeaveQuotaByEmployeeId) remain the same
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