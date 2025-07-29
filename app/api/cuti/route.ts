import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import {
  createCuti,
  getCutiByUserId,
  getAllCuti,
  getApprovalFlow,
  createApprovalLogs,
  createNotification,
  getCutiKuotaByUser,
  sql, // Declared sql variable here
} from "@/lib/db"

export async function GET() {
  try {
    const user = await requireAuth()

    if (user.role === "superadmin") {
      const cutiList = await getAllCuti()
      return NextResponse.json(cutiList)
    } else if (user.role === "admin") {
      // Admin can see all cuti from their lembaga
      const cutiList = await getAllCuti() // TODO: Filter by lembaga
      return NextResponse.json(cutiList)
    } else {
      const cutiList = await getCutiByUserId(user.id)
      return NextResponse.json(cutiList)
    }
  } catch (error) {
    console.error("Error fetching cuti:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== "karyawan") {
      return NextResponse.json({ error: "Hanya karyawan yang dapat mengajukan cuti" }, { status: 403 })
    }

    const formData = await request.formData()
    const jenis_cuti_id = Number.parseInt(formData.get("jenis_cuti_id") as string)
    const tanggal_mulai = formData.get("tanggal_mulai") as string
    const tanggal_selesai = formData.get("tanggal_selesai") as string
    const alasan = formData.get("alasan") as string
    const days_requested = Number.parseInt(formData.get("days_requested") as string)
    const dokumen = formData.get("dokumen") as File | null

    if (!jenis_cuti_id || !tanggal_mulai || !tanggal_selesai || !alasan) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }

    // Check kuota
    const kuotaList = await getCutiKuotaByUser(user.id)
    const kuota = kuotaList.find((k) => k.jenis_cuti_id === jenis_cuti_id)

    if (!kuota) {
      return NextResponse.json({ error: "Kuota cuti tidak ditemukan" }, { status: 400 })
    }

    const sisaKuota = kuota.jatah_total - kuota.jatah_terpakai
    if (days_requested > sisaKuota) {
      return NextResponse.json(
        {
          error: `Jumlah hari yang diminta (${days_requested}) melebihi sisa kuota (${sisaKuota})`,
        },
        { status: 400 },
      )
    }

    // Handle file upload (simplified - in production, use proper file storage)
    let dokumenPath = null
    if (dokumen && dokumen.size > 0) {
      // In a real app, you'd upload to cloud storage
      dokumenPath = `uploads/${Date.now()}-${dokumen.name}`
    }

    // Create cuti record
    const newCuti = await createCuti({
      user_id: user.id,
      jenis_cuti_id,
      tanggal_mulai,
      tanggal_selesai,
      alasan,
      dokumen: dokumenPath,
    })

    // Get approval flow
    if (user.lembaga_id) {
      const approvalFlow = await getApprovalFlow(user.lembaga_id, jenis_cuti_id)

      if (approvalFlow.length > 0) {
        // Create approval logs
        await createApprovalLogs(newCuti.id, approvalFlow)

        // Update cuti status to dalam_proses
        await sql`
          UPDATE cuti 
          SET status = 'dalam_proses', approval_terakhir_level = 1
          WHERE id = ${newCuti.id}
        `

        // Notify first approver
        await createNotification(approvalFlow[0].approver_id, `Pengajuan cuti baru dari ${user.nama} perlu direview`)
      }
    }

    return NextResponse.json(newCuti, { status: 201 })
  } catch (error) {
    console.error("Error creating cuti:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
