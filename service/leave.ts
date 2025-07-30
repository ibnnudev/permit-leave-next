import prisma from "@/lib/prisma";

export async function getAllLeave() {
    return prisma.leave.findMany({
        include: {
            employee: true,
            approvalLogs: true,
            leaveType: {
                include: {
                    approvalFlows: {
                        include: {
                            approvers: true,
                        },
                    },
                },
            },
        },
    });
}

export async function getLeaveByUserId(userId: number) {
    return prisma.leave.findMany({
        where: { employee_id: userId },
        include: {
            leaveType: true,
        },
    });
}

export async function getLeaveQuotaByUser(userId: number) {
    return prisma.leaveQuota.findMany({
        where: { employee_id: userId },
        include: {
            leaveType: true,
        },
    });
}

export async function getLeaveByApprover(userId: number) {
    return prisma.leave.findMany({
        include: {
            employee: true,
            approvalLogs: true,
            leaveType: {
                include: {
                    approvalFlows: {
                        include: {
                            approvers: true,
                        },
                    },
                },
            },
        },
    });
}

export async function getTotalLeavePerStatusViaFlow(userId: number) {
    const allLeave = await getLeaveByApprover(userId);

    const relevantLeave = allLeave.filter((leave) => {
        const institutionId = leave.employee.institution_id;
        const level = leave.last_processed_level;

        const matchingFlow = leave.leaveType.approvalFlows.find(
            (flow) =>
                flow.level === level &&
                flow.institution_id === institutionId &&
                flow.approvers.some((a) => a.employee_id === userId)
        );

        return Boolean(matchingFlow);
    });

    // Group by status
    const grouped: Record<string, number> = {};
    for (const leave of relevantLeave) {
        grouped[leave.status] = (grouped[leave.status] || 0) + 1;
    }

    // Format output
    return Object.entries(grouped).map(([status, total]) => ({
        status,
        total,
    }));
}
