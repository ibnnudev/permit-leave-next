import prisma from "@/lib/prisma";

export async function getCutiByUserId(userId: number) {
  return prisma.cuti.findMany({
    where: { pegawai_id: userId },
    include: {
      jenisCuti: true,
    },
  });
}

export async function getCutiKuotaByUser(userId: number) {
  return prisma.kuotaCuti.findMany({
    where: { pegawai_id: userId },
    include: {
      jenisCuti: true,
    },
  });
}

export async function getCutiByApprover(userId: number) {
  return prisma.cuti.findMany({
    include: {
      pegawai: {
        select: {
          lembaga_id: true,
        },
      },
      log_persetujuan: true,
      jenisCuti: {
        include: {
          alurPersetujuan: {
            include: {
              approver: true,
            },
          },
        },
      },
    },
  });
}

export async function getTotalCutiPerStatusViaAlur(userId: number) {
  const allCuti = await getCutiByApprover(userId);

  const relevantCuti = allCuti.filter((cuti) => {
    const lembagaId = cuti.pegawai.lembaga_id;
    const level = cuti.level_terakhir_diproses;

    const matchingAlur = cuti.jenisCuti.alurPersetujuan.find(
      (alur) =>
        alur.level === level &&
        alur.lembaga_id === lembagaId &&
        alur.approver.some((a) => a.pegawai_id === userId)
    );

    return Boolean(matchingAlur);
  });

  // Group by status
  const grouped: Record<string, number> = {};
  for (const cuti of relevantCuti) {
    grouped[cuti.status] = (grouped[cuti.status] || 0) + 1;
  }

  // Format output
  return Object.entries(grouped).map(([status, total]) => ({
    status,
    total,
  }));
}
