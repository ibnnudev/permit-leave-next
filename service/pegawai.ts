import prisma from "@/lib/prisma";
import { Pegawai } from "@prisma/client";

export async function getAllPegawai(lembagaId?: number) {
  return prisma.pegawai.findMany({
    where: lembagaId ? { lembaga_id: lembagaId } : undefined,
    include: {
      lembaga: true,
      kuota_cuti: {
        include: {
          jenisCuti: true,
        },
      },
    },
  });
}

export async function getPegawaiById(id: number) {
  return prisma.pegawai.findUnique({
    where: { id },
    include: {
      lembaga: true,
      kuota_cuti: {
        include: {
          jenisCuti: true,
        },
      },
    },
  });
}

export async function createPegawai(data: Pegawai) {
  return prisma.pegawai.create({
    data,
  });
}

export async function getJatahCutiByPegawaiId(
  userId: number,
  year: number = new Date().getFullYear()
) {
  return prisma.kuotaCuti.findMany({
    where: { pegawai_id: userId, tahun: year },
    include: {
      jenisCuti: true,
    },
  });
}
