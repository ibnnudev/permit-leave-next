import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const currentYear = new Date().getFullYear();

// Fungsi untuk menghasilkan nama Indonesia yang lebih realistis
const generateIndonesianName = (gender: string) => {
  const maleFirstNames = [
    "Ahmad",
    "Budi",
    "Cahya",
    "Dedi",
    "Eko",
    "Fajar",
    "Gunawan",
    "Hadi",
    "Irfan",
    "Joko",
  ];
  const femaleFirstNames = [
    "Ani",
    "Bunga",
    "Citra",
    "Dewi",
    "Eka",
    "Fitri",
    "Gita",
    "Hani",
    "Intan",
    "Juli",
  ];
  const lastNames = [
    "Santoso",
    "Wijaya",
    "Pratama",
    "Kusuma",
    "Hidayat",
    "Nugroho",
    "Siregar",
    "Tanuwijaya",
    "Halim",
    "Susanto",
  ];

  const firstName = gender === "Male" 
    ? faker.helpers.arrayElement(maleFirstNames)
    : faker.helpers.arrayElement(femaleFirstNames);
  
  return `${firstName} ${faker.helpers.arrayElement(lastNames)}`;
};

// Fungsi untuk menghasilkan alamat Indonesia
const generateIndonesianAddress = () => {
  const streets = ["Jl. Merdeka", "Jl. Sudirman", "Jl. Gatot Subroto", "Jl. Thamrin", "Jl. Hayam Wuruk"];
  const cities = ["Jakarta", "Bandung", "Surabaya", "Medan", "Yogyakarta"];
  return `${faker.helpers.arrayElement(streets)} No. ${faker.number.int({min: 1, max: 200})}, ${faker.helpers.arrayElement(cities)}`;
};

async function main() {
  console.log("🔄 Menjalankan seeder...");

  const password = await bcrypt.hash("password123", 12);

  // 1. Institusi Pendidikan
  const institutions = await Promise.all([
    prisma.institution.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "Yayasan Pendidikan Nurul Ilmi",
        address: "Jl. Pendidikan No. 123, Jakarta Selatan",
        phone: "+628123456789",
      },
    }),
    prisma.institution.create({
      data: {
        name: "Sekolah Islam Terpadu Al-Azhar",
        address: "Jl. Pendidikan No. 45, Bandung",
        phone: "+628987654321",
      },
    }),
    prisma.institution.create({
      data: {
        name: "Sekolah Bina Bangsa",
        address: "Jl. Raya Pendidikan No. 67, Surabaya",
        phone: "+628112233445",
      },
    }),
  ]);

  // 2. Data Karyawan (superadmin, admin, dan karyawan biasa)
  const employeeData = [
    // Super Admin
    {
      id: 1,
      institution_id: institutions[0].id,
      name: "Admin Utama",
      gender: "Male",
      position: "Ketua Yayasan",
      whatsapp_number: "+628123456780",
      address: "Jl. Kenangan No. 10, Jakarta",
      birth_place: "Bandung",
      birth_date: new Date("1975-05-10"),
      join_date: new Date("2015-01-15"),
      marital_status: "Married",
      employment_status: "Active",
      personal_email: "admin.utama@personal.com",
      institution_email: "admin.utama@nurulilmi.sch.id",
      religion: "Islam",
      last_education: "S2 Manajemen Pendidikan",
      password,
      role: Role.SUPERADMIN,
    },
    // Admin 1
    {
      id: 2,
      institution_id: institutions[0].id,
      name: "Dewi Sartika",
      gender: "Female",
      position: "Kepala Sekolah",
      whatsapp_number: "+628123456781",
      address: "Jl. Pendidikan No. 45, Jakarta",
      birth_place: "Jakarta",
      birth_date: new Date("1980-08-17"),
      join_date: new Date("2018-03-01"),
      marital_status: "Married",
      employment_status: "Active",
      personal_email: "dewi.sartika@personal.com",
      institution_email: "kepsek@nurulilmi.sch.id",
      religion: "Islam",
      last_education: "S2 Pendidikan",
      password,
      role: Role.ADMIN,
    },
    // Admin 2
    {
      id: 3,
      institution_id: institutions[0].id,
      name: "Budi Santoso",
      gender: "Male",
      position: "Kepala HRD",
      whatsapp_number: "+628123456782",
      address: "Jl. HRD No. 12, Jakarta",
      birth_place: "Surabaya",
      birth_date: new Date("1982-11-25"),
      join_date: new Date("2019-06-10"),
      marital_status: "Married",
      employment_status: "Active",
      personal_email: "budi.santoso@personal.com",
      institution_email: "hrd@nurulilmi.sch.id",
      religion: "Islam",
      last_education: "S1 Psikologi",
      password,
      role: Role.ADMIN,
    },
    // Guru 1
    {
      id: 4,
      institution_id: institutions[0].id,
      name: "Ahmad Fauzi",
      gender: "Male",
      position: "Guru Matematika",
      whatsapp_number: "+628123456783",
      address: "Jl. Guru No. 33, Jakarta",
      birth_place: "Bandung",
      birth_date: new Date("1985-04-15"),
      join_date: new Date("2020-02-15"),
      marital_status: "Married",
      employment_status: "Active",
      personal_email: "ahmad.fauzi@personal.com",
      institution_email: "ahmad.fauzi@nurulilmi.sch.id",
      religion: "Islam",
      last_education: "S1 Pendidikan Matematika",
      password,
      role: Role.EMPLOYEE,
    },
    // Guru 2
    {
      id: 5,
      institution_id: institutions[0].id,
      name: "Siti Rahayu",
      gender: "Female",
      position: "Guru Bahasa Indonesia",
      whatsapp_number: "+628123456784",
      address: "Jl. Sastra No. 56, Jakarta",
      birth_place: "Yogyakarta",
      birth_date: new Date("1988-07-20"),
      join_date: new Date("2021-01-05"),
      marital_status: "Single",
      employment_status: "Active",
      personal_email: "siti.rahayu@personal.com",
      institution_email: "siti.rahayu@nurulilmi.sch.id",
      religion: "Islam",
      last_education: "S1 Sastra Indonesia",
      password,
      role: Role.EMPLOYEE,
    },
    // Staff 1
    {
      id: 6,
      institution_id: institutions[0].id,
      name: "Rina Wijaya",
      gender: "Female",
      position: "Staff Administrasi",
      whatsapp_number: "+628123456785",
      address: "Jl. Administrasi No. 78, Jakarta",
      birth_place: "Jakarta",
      birth_date: new Date("1990-12-05"),
      join_date: new Date("2021-08-15"),
      marital_status: "Single",
      employment_status: "Active",
      personal_email: "rina.wijaya@personal.com",
      institution_email: "rina.wijaya@nurulilmi.sch.id",
      religion: "Christian",
      last_education: "D3 Administrasi",
      password,
      role: Role.EMPLOYEE,
    },
  ];

  // Tambahkan 20 karyawan acak untuk pengujian
  for (let i = 7; i <= 26; i++) {
    const gender = faker.helpers.arrayElement(["Male", "Female"]);
    const name = generateIndonesianName(gender);
    const position = faker.helpers.arrayElement([
      "Guru Kelas",
      "Guru Matematika",
      "Guru Bahasa Inggris",
      "Guru IPA",
      "Guru Agama",
      "Staff Administrasi",
      "Staff Perpustakaan",
      "Staff IT",
      "Bendahara Sekolah",
      "Petugas Kebersihan",
    ]);

    employeeData.push({
      id: i,
      institution_id: institutions[0].id,
      name,
      gender,
      position,
      whatsapp_number: `+628${faker.string.numeric(9)}`,
      address: generateIndonesianAddress(),
      birth_place: faker.helpers.arrayElement(["Jakarta", "Bandung", "Surabaya", "Medan", "Yogyakarta"]),
      birth_date: faker.date.birthdate({ min: 22, max: 55, mode: "age" }),
      join_date: faker.date.between({ from: '2018-01-01', to: '2023-01-01' }),
      marital_status: faker.helpers.arrayElement(["Single", "Married"]),
      employment_status: faker.helpers.arrayElement(["Active", "Probation"]),
      personal_email: faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] }),
      institution_email: faker.internet.email({ 
        firstName: name.split(' ')[0], 
        lastName: name.split(' ')[1],
        provider: "nurulilmi.sch.id"
      }),
      religion: faker.helpers.arrayElement(["Islam", "Christian", "Catholic", "Hindu", "Buddhist"]),
      last_education: faker.helpers.arrayElement([
        "SMA",
        "D3",
        "S1 Pendidikan",
        "S1 Non Pendidikan",
        "S2 Pendidikan",
      ]),
      password,
      role: Role.EMPLOYEE,
    });
  }

  await prisma.employee.createMany({
    data: employeeData,
    skipDuplicates: true,
  });

  // 3. Jenis Cuti (sesuai aturan sekolah)
  const leaveTypes = await prisma.leaveType.createMany({
    data: [
      {
        id: 1,
        name: "Cuti Sakit",
        description: "Cuti karena sakit dengan surat dokter",
        max_days: 14,
        require_document: true,
        hierarchical: true,
      },
      {
        id: 2,
        name: "Cuti Melahirkan",
        description: "Cuti untuk ibu melahirkan",
        max_days: 90,
        require_document: true,
        hierarchical: false,
      },
      {
        id: 3,
        name: "Cuti Menikah",
        description: "Cuti untuk pernikahan karyawan",
        max_days: 7,
        require_document: true,
        hierarchical: true,
      },
      {
        id: 4,
        name: "Cuti Tahunan",
        description: "Cuti tahunan karyawan",
        max_days: 12,
        require_document: false,
        hierarchical: true,
      },
      {
        id: 5,
        name: "Cuti Keluarga Meninggal",
        description: "Cuti karena keluarga inti meninggal dunia",
        max_days: 3,
        require_document: true,
        hierarchical: false,
      },
      {
        id: 6,
        name: "Cuti Alasan Penting",
        description: "Cuti untuk keperluan penting lainnya",
        max_days: 5,
        require_document: true,
        hierarchical: true,
      },
      {
        id: 7,
        name: "Cuti Haid",
        description: "Cuti khusus untuk karyawan wanita saat haid",
        max_days: 2,
        require_document: false,
        hierarchical: false,
      },
    ],
    skipDuplicates: true,
  });

  // 4. Kuota Cuti untuk semua karyawan
  const employees = await prisma.employee.findMany();
  const leaveQuotaData = [];

  for (const employee of employees) {
    for (const leaveType of await prisma.leaveType.findMany()) {
      // Skip cuti melahirkan dan haid untuk karyawan pria
      if ((leaveType.id === 2 || leaveType.id === 7) && employee.gender === "Male") continue;

      leaveQuotaData.push({
        employee_id: employee.id,
        leave_type_id: leaveType.id,
        year: currentYear,
        total_quota: leaveType.max_days,
        used_quota: 0,
      });
    }
  }

  await prisma.leaveQuota.createMany({
    data: leaveQuotaData,
    skipDuplicates: true,
  });

  // 5. Alur Persetujuan
  const approvalFlows = await Promise.all([
    // Cuti Sakit (2 level)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 1,
        level: 1,
        created_by_id: 1,
      },
    }),
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 1,
        level: 2,
        created_by_id: 1,
      },
    }),
    // Cuti Melahirkan (1 level)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 2,
        level: 1,
        created_by_id: 1,
      },
    }),
    // Cuti Menikah (1 level)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 3,
        level: 1,
        created_by_id: 1,
      },
    }),
    // Cuti Tahunan (3 level)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 4,
        level: 1,
        created_by_id: 1,
      },
    }),
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 4,
        level: 2,
        created_by_id: 1,
      },
    }),
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 4,
        level: 3,
        created_by_id: 1,
      },
    }),
    // Cuti Keluarga Meninggal (1 level)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 5,
        level: 1,
        created_by_id: 1,
      },
    }),
    // Cuti Alasan Penting (2 level)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 6,
        level: 1,
        created_by_id: 1,
      },
    }),
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 6,
        level: 2,
        created_by_id: 1,
      },
    }),
    // Cuti Haid (tidak perlu persetujuan)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 7,
        level: 1,
        created_by_id: 1,
      },
    }),
  ]);

  // 6. Penentuan Approver untuk Alur Persetujuan
  await prisma.approvalFlowEmployee.createMany({
    data: [
      // Level 1 Cuti Sakit (Kepala Sekolah)
      {
        approval_flow_id: approvalFlows[0].id,
        employee_id: 2, // Kepala Sekolah
      },
      // Level 2 Cuti Sakit (Ketua Yayasan)
      {
        approval_flow_id: approvalFlows[1].id,
        employee_id: 1, // Ketua Yayasan
      },
      // Cuti Melahirkan (HRD)
      {
        approval_flow_id: approvalFlows[2].id,
        employee_id: 3, // Kepala HRD
      },
      // Cuti Menikah (HRD)
      {
        approval_flow_id: approvalFlows[3].id,
        employee_id: 3, // Kepala HRD
      },
      // Level 1 Cuti Tahunan (Kepala Sekolah)
      {
        approval_flow_id: approvalFlows[4].id,
        employee_id: 2, // Kepala Sekolah
      },
      // Level 2 Cuti Tahunan (HRD)
      {
        approval_flow_id: approvalFlows[5].id,
        employee_id: 3, // Kepala HRD
      },
      // Level 3 Cuti Tahunan (Ketua Yayasan)
      {
        approval_flow_id: approvalFlows[6].id,
        employee_id: 1, // Ketua Yayasan
      },
      // Cuti Keluarga Meninggal (HRD)
      {
        approval_flow_id: approvalFlows[7].id,
        employee_id: 3, // Kepala HRD
      },
      // Level 1 Cuti Alasan Penting (Kepala Sekolah)
      {
        approval_flow_id: approvalFlows[8].id,
        employee_id: 2, // Kepala Sekolah
      },
      // Level 2 Cuti Alasan Penting (Ketua Yayasan)
      {
        approval_flow_id: approvalFlows[9].id,
        employee_id: 1, // Ketua Yayasan
      },
      // Cuti Haid (Otomatis disetujui)
      {
        approval_flow_id: approvalFlows[10].id,
        employee_id: 3, // Kepala HRD
      },
    ],
  });

  // 7. Membuat data cuti contoh
  const leaveData = [];
  const statuses: ("PENDING" | "IN_PROCESS" | "APPROVED" | "REJECTED")[] = [
    "PENDING",
    "IN_PROCESS",
    "APPROVED",
    "REJECTED",
  ];

  // Membuat cuti untuk setiap karyawan (kecuali super admin)
  for (const employee of employees.filter((e) => e.role !== "SUPERADMIN")) {
    const leaveTypes = await prisma.leaveType.findMany();

    for (const leaveType of leaveTypes) {
      // Skip cuti melahirkan dan haid untuk karyawan pria
      if ((leaveType.id === 2 || leaveType.id === 7) && employee.gender === "Male") continue;

      // Buat 1-3 cuti per jenis per karyawan
      const count = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < count; i++) {
        const startDate = faker.date.soon({ days: 30 });
        const endDate = faker.date.soon({
          days: faker.number.int({ min: 1, max: leaveType.max_days }),
          refDate: startDate,
        });

        const status = faker.helpers.arrayElement(statuses);
        const level =
          status === "PENDING"
            ? 0
            : status === "IN_PROCESS"
            ? faker.number.int({ min: 1, max: 2 })
            : status === "APPROVED"
            ? 3
            : 0;

        // Alasan cuti yang lebih realistis
        let reason = "";
        if (leaveType.id === 1) {
          reason = faker.helpers.arrayElement([
            "Sakit demam tinggi",
            "Operasi kecil",
            "Istirahat sesuai anjuran dokter",
            "Kontrol rutin ke rumah sakit",
          ]);
        } else if (leaveType.id === 2) {
          reason = "Melahirkan anak pertama";
        } else if (leaveType.id === 3) {
          reason = "Pernikahan dengan pasangan";
        } else if (leaveType.id === 4) {
          reason = faker.helpers.arrayElement([
            "Liburan keluarga",
            "Istirahat setelah ujian",
            "Recovery setelah kerja keras",
          ]);
        } else if (leaveType.id === 5) {
          reason = faker.helpers.arrayElement([
            "Ayah meninggal dunia",
            "Ibu meninggal dunia",
            "Suami meninggal dunia",
          ]);
        } else if (leaveType.id === 6) {
          reason = faker.helpers.arrayElement([
            "Urusan keluarga penting",
            "Menghadiri wisuda anak",
            "Menjadi saksi di pengadilan",
          ]);
        } else if (leaveType.id === 7) {
          reason = "Haid hari pertama";
        }

        leaveData.push({
          employee_id: employee.id,
          leave_type_id: leaveType.id,
          start_date: startDate,
          end_date: endDate,
          reason,
          status,
          last_processed_level: level,
          admin_notes: status === "REJECTED" 
            ? faker.helpers.arrayElement([
                "Dokumen tidak lengkap",
                "Jumlah hari melebihi ketentuan",
                "Tidak sesuai dengan jadwal sekolah",
              ])
            : null,
          recorded_by: faker.helpers.arrayElement([
            "System",
            "HRD",
            "Kepala Sekolah",
          ]),
          approved_by_id:
            status === "APPROVED"
              ? faker.helpers.arrayElement([1, 2, 3])
              : null,
          document: leaveType.require_document
            ? `https://example.com/documents/${faker.string.uuid()}.pdf`
            : null,
          created_at: faker.date.past({ years: 1 }),
          updated_at: faker.date.recent(),
        });
      }
    }
  }

  // Masukkan semua data cuti
  for (const leave of leaveData) {
    await prisma.leave.create({
      data: leave,
    });
  }

  // 8. Membuat log persetujuan untuk cuti
  const leaves = await prisma.leave.findMany();

  for (const leave of leaves) {
    if (leave.status === "PENDING") continue;

    const flow = await prisma.approvalFlow.findFirst({
      where: { leave_type_id: leave.leave_type_id, level: 1 },
    });

    if (!flow) continue;

    const approvers = await prisma.approvalFlowEmployee.findMany({
      where: { approval_flow_id: flow.id },
    });

    if (approvers.length === 0) continue;

    // Buat log untuk persetujuan level 1
    await prisma.approvalLog.create({
      data: {
        leave_id: leave.id,
        employee_id: approvers[0].employee_id,
        level: 1,
        status:
          leave.status === "REJECTED"
            ? "REJECTED"
            : leave.last_processed_level > 1
            ? "APPROVED"
            : "PENDING",
        notes:
          leave.status === "REJECTED"
            ? leave.admin_notes
            : faker.helpers.arrayElement([
                "Silakan dilanjutkan ke level berikutnya",
                "Cuti disetujui level 1",
                "Sesuai dengan ketentuan",
              ]),
        approval_date: leave.status === "REJECTED" ? faker.date.recent() : null,
        approval_deadline: faker.date.soon({ days: 3 }),
      },
    });

    // Jika ada level kedua dan cuti tidak ditolak
    if (leave.last_processed_level > 1 && leave.status !== "REJECTED") {
      const flowLevel2 = await prisma.approvalFlow.findFirst({
        where: { leave_type_id: leave.leave_type_id, level: 2 },
      });

      if (flowLevel2) {
        const approversLevel2 = await prisma.approvalFlowEmployee.findMany({
          where: { approval_flow_id: flowLevel2.id },
        });

        if (approversLevel2.length > 0) {
          await prisma.approvalLog.create({
            data: {
              leave_id: leave.id,
              employee_id: approversLevel2[0].employee_id,
              level: 2,
              status: leave.status === "APPROVED" ? "APPROVED" : "PENDING",
              notes:
                leave.status === "APPROVED"
                  ? faker.helpers.arrayElement([
                      "Cuti disetujui",
                      "Sesuai dengan kebijakan",
                      "Silakan mengambil cuti",
                    ])
                  : null,
              approval_date:
                leave.status === "APPROVED" ? faker.date.recent() : null,
              approval_deadline: faker.date.soon({ days: 3 }),
            },
          });
        }
      }
    }
  }

  // 9. Notifikasi
  const notificationData = [];

  for (const employee of employees) {
    // 3-10 notifikasi per karyawan
    const count = faker.number.int({ min: 3, max: 10 });

    for (let i = 0; i < count; i++) {
      notificationData.push({
        employee_id: employee.id,
        message: faker.helpers.arrayElement([
          `Selamat datang di sistem manajemen cuti, ${employee.name.split(' ')[0]}!`,
          "Pengajuan cuti Anda telah diterima",
          "Pengajuan cuti Anda telah disetujui",
          "Pengajuan cuti Anda memerlukan informasi tambahan",
          "Anda memiliki pengajuan cuti baru yang perlu disetujui",
          "Pengingat: Pengajuan cuti Anda masih menunggu persetujuan",
          "Kuota cuti Anda telah diperbarui",
          "Jadwal libur semester telah diumumkan",
          "Penting: Pembaruan kebijakan mengenai pengajuan cuti",
          `Selamat ulang tahun, ${employee.name.split(' ')[0]}! Semoga harimu menyenangkan!`,
          "Pengingat: Batas akhir pengajuan cuti tahunan mendekati",
          "Workshop manajemen stres akan diadakan bulan depan",
        ]),
        is_read: faker.datatype.boolean(),
        created_at: faker.date.past({ years: 1 }),
      });
    }
  }

  await prisma.notification.createMany({
    data: notificationData,
  });

  // 10. Update kuota cuti yang terpakai berdasarkan cuti yang disetujui
  const approvedLeaves = await prisma.leave.findMany({
    where: { status: "APPROVED" },
  });

  for (const leave of approvedLeaves) {
    const days =
      Math.ceil(
        (leave.end_date.getTime() - leave.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1; // Termasuk tanggal akhir

    await prisma.leaveQuota.updateMany({
      where: {
        employee_id: leave.employee_id,
        leave_type_id: leave.leave_type_id,
        year: currentYear,
      },
      data: {
        used_quota: { increment: days },
      },
    });
  }

  console.log("✅ Seeder selesai dengan sukses!");
  console.log("\n📋 Akun Login:");
  console.log("Superadmin: admin.utama@nurulilmi.sch.id / password123");
  console.log("Kepala Sekolah: kepsek@nurulilmi.sch.id / password123");
  console.log("HRD: hrd@nurulilmi.sch.id / password123");
  console.log("Guru Matematika: ahmad.fauzi@nurulilmi.sch.id / password123");
  console.log("Guru Bahasa: siti.rahayu@nurulilmi.sch.id / password123");
  console.log("Staff Admin: rina.wijaya@nurulilmi.sch.id / password123");
  console.log("\n📊 Ringkasan Data:");
  console.log(`- Institusi: ${institutions.length}`);
  console.log(`- Karyawan: ${employees.length}`);
  console.log(`- Jenis Cuti: ${await prisma.leaveType.count()}`);
  console.log(`- Kuota Cuti: ${await prisma.leaveQuota.count()}`);
  console.log(`- Alur Persetujuan: ${approvalFlows.length}`);
  console.log(`- Data Cuti: ${leaves.length}`);
  console.log(`- Log Persetujuan: ${await prisma.approvalLog.count()}`);
  console.log(`- Notifikasi: ${notificationData.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Gagal menjalankan seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });