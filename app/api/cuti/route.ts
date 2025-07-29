import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await requireRole(["superadmin", "admin", "employee"]);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.role === "superadmin") {
      const cutiList = await prisma.leaveRequest.findMany();
      return NextResponse.json(cutiList);
    } else if (user.role === "admin") {
      // Admin can see all cuti from their lembaga
      const cutiList = await prisma.leaveRequest.findMany(); // TODO: Filter by lembaga
      return NextResponse.json(cutiList);
    } else {
      const cutiList = await prisma.leaveRequest.findMany({
        where: {
          user_id: user.id,
        },
        include: {
          user,
        },
      });
      return NextResponse.json(cutiList);
    }
  } catch (error) {
    console.error("Error fetching cuti:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["karyawan"]);
    if (user.role !== "karyawan") {
      return NextResponse.json(
        { error: "Hanya karyawan yang dapat mengajukan cuti" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const jenis_cuti_id = Number.parseInt(
      formData.get("jenis_cuti_id") as string
    );
    const tanggal_mulai = formData.get("tanggal_mulai") as string;
    const tanggal_selesai = formData.get("tanggal_selesai") as string;
    const alasan = formData.get("alasan") as string;
    const days_requested = Number.parseInt(
      formData.get("days_requested") as string
    );
    const dokumen = formData.get("dokumen") as File | null;

    if (!jenis_cuti_id || !tanggal_mulai || !tanggal_selesai || !alasan) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Check kuota
    const kuota = await prisma.kuotaCuti.findFirst({
      where: {
        user_id: user.id,
      },
    });

    if (!kuota) {
      return NextResponse.json(
        { error: "Kuota cuti tidak ditemukan" },
        { status: 400 }
      );
    }

    const sisaKuota = kuota.total_quota - kuota.used_quota;
    if (days_requested > sisaKuota) {
      return NextResponse.json(
        {
          error: `Jumlah hari yang diminta (${days_requested}) melebihi sisa kuota (${sisaKuota})`,
        },
        { status: 400 }
      );
    }

    // Handle file upload (simplified - in production, use proper file storage)
    let dokumenPath = null;
    if (dokumen && dokumen.size > 0) {
      // In a real app, you'd upload to cloud storage
      dokumenPath = `uploads/${Date.now()}-${dokumen.name}`;
    }

    // Create cuti record
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        user_id: user.id,
        jenis_cuti_id,
        start_date: tanggal_mulai,
        end_date: tanggal_selesai,
        total_days: days_requested,
        reason: alasan,
        status: "pending",
      },
      include: {
        user: true,
      },
    });

    // Get approval flow
    const approvalLevels = await prisma.user.findMany({
      where: {
        role: { in: ["admin", "superadmin"] },
      },
      orderBy: {
        role: "desc", // superadmin (tingkat tinggi) dulu
      },
      select: {
        id: true,
        role: true,
        name: true,
      },
    });

    for (let i = 0; i < approvalLevels.length; i++) {
      await prisma.approvalLog.create({
        data: {
          leave_request_id: leaveRequest.id,
          approver_id: approvalLevels[i].id,
          level: i + 1,
          status: "pending",
        },
      });
    }

    // Kirim notifikasi ke approver level 1
    // if (approvalLevels.length > 0) {
    //   await createNotification(
    //     approvalLevels[0].id,
    //     `Pengajuan cuti dari ${user.name} menunggu persetujuan Anda`
    //   );
    // }

    return NextResponse.json(
      { message: "Cuti berhasil diajukan", data: leaveRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting leave:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
