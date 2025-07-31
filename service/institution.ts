import prisma from "@/lib/prisma";

export const getAllInstitutions = async ({
    institutionId,
}: {
    institutionId?: number;
}) => {
    return prisma.institution.findMany({
        where: institutionId ? { id: institutionId } : undefined,
        include: {
            employees: true
        },
    })
}