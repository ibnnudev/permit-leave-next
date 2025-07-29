import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const tahunSekarang = new Date().getFullYear();

async function main() {
  console.log("🔄 Menjalankan seeder...");

  const password = await bcrypt.hash("password", 12);

  // 1. Lembaga
  const lembaga = await prisma.lembaga.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nama: "Yayasan Nurul Ilmi",
      alamat: "Jl. Pendidikan No. 123",
      telepon: "08123456789",
    },
  });

  // 2. Pegawai (superadmin & admin sebagai approver)
  await prisma.pegawai.createMany({
    data: [
      {
        id: 1,
        lembaga_id: lembaga.id,
        nama: "Super Admin",
        jenis_kelamin: "Laki-laki",
        jabatan: "Pengawas Yayasan",
        no_wa: "08123456780",
        alamat: "Jl. Utama",
        tempat_lahir: "Bandung",
        tanggal_lahir: new Date("1980-01-01"),
        tmt: new Date("2020-01-01"),
        status_pernikahan: "Menikah",
        status_pegawai: "Aktif",
        email_pribadi: "superadmin@personal.com",
        email_yayasan: "superadmin@yayasan.com",
        agama: "Islam",
        pendidikan_terakhir: "S2",
        kata_sandi: password,
        peran: "SUPERADMIN",
      },
      {
        id: 2,
        lembaga_id: lembaga.id,
        nama: "Admin Pendidikan",
        jenis_kelamin: "Perempuan",
        jabatan: "Manajer Pendidikan",
        no_wa: "08123456781",
        alamat: "Jl. Pendidikan",
        tempat_lahir: "Jakarta",
        tanggal_lahir: new Date("1985-05-01"),
        tmt: new Date("2021-01-01"),
        status_pernikahan: "Menikah",
        status_pegawai: "Aktif",
        email_pribadi: "admin@personal.com",
        email_yayasan: "admin@yayasan.com",
        agama: "Islam",
        pendidikan_terakhir: "S1",
        kata_sandi: password,
        peran: "ADMIN",
      },
      {
        id: 3,
        lembaga_id: lembaga.id,
        nama: "Guru 1",
        jenis_kelamin: "Laki-laki",
        jabatan: "Guru",
        no_wa: "08123456782",
        alamat: "Jl. Cendrawasih",
        tempat_lahir: "Surabaya",
        tanggal_lahir: new Date("1990-03-03"),
        tmt: new Date("2022-01-01"),
        status_pernikahan: "Belum Menikah",
        status_pegawai: "Aktif",
        email_pribadi: "guru1@personal.com",
        email_yayasan: "guru1@yayasan.com",
        agama: "Islam",
        pendidikan_terakhir: "S1",
        kata_sandi: password,
        peran: "KARYAWAN",
      },
    ],
    skipDuplicates: true,
  });

  // 3. Jenis Cuti
  const jenisCuti = await prisma.jenisCuti.createMany({
    data: [
      {
        id: 1,
        nama_izin: "Sakit",
        deskripsi: "Cuti ketika pegawai jatuh sakit.",
        maksimal_hari: 2,
        perlu_dokumen: true,
        berjenjang: true,
      },
      {
        id: 2,
        nama_izin: "Menikah",
        deskripsi: "Cuti saat menikah",
        maksimal_hari: 7,
        perlu_dokumen: false,
        berjenjang: true,
      },
    ],
    skipDuplicates: true,
  });

  // 4. Kuota Cuti
  await prisma.kuotaCuti.createMany({
    data: [
      {
        pegawai_id: 3,
        jenis_cuti_id: 1,
        tahun: tahunSekarang,
        jatah_total: 2,
        jatah_terpakai: 0,
      },
      {
        pegawai_id: 3,
        jenis_cuti_id: 2,
        tahun: tahunSekarang,
        jatah_total: 7,
        jatah_terpakai: 0,
      },
    ],
    skipDuplicates: true,
  });

  // 5. Alur Persetujuan
  const alur1 = await prisma.alurPersetujuan.create({
    data: {
      lembaga_id: lembaga.id,
      jenis_cuti_id: 1,
      level: 1,
      dibuat_oleh_id: 1,
    },
  });
  const alur2 = await prisma.alurPersetujuan.create({
    data: {
      lembaga_id: lembaga.id,
      jenis_cuti_id: 1,
      level: 2,
      dibuat_oleh_id: 1,
    },
  });

  // 6. Alur Persetujuan Pegawai (approver bisa lebih dari satu)
  await prisma.alurPersetujuanPegawai.createMany({
    data: [
      {
        alur_persetujuan_id: alur1.id,
        pegawai_id: 2, // Admin Pendidikan
      },
      {
        alur_persetujuan_id: alur1.id,
        pegawai_id: 1, // Super Admin juga bisa
      },
      {
        alur_persetujuan_id: alur2.id,
        pegawai_id: 1, // Super Admin
      },
    ],
  });

  // 7. Notifikasi
  await prisma.notifikasi.createMany({
    data: [
      {
        pegawai_id: 3,
        pesan: "Selamat datang di sistem manajemen cuti!",
        dibaca: false,
      },
      {
        pegawai_id: 3,
        pesan: "Silakan periksa kuota cuti Anda.",
        dibaca: false,
      },
    ],
  });

  console.log("✅ Seeder selesai dijalankan!");
  console.log("\n📋 Akun Login:");
  console.log("Superadmin: superadmin@yayasan.com / password");
  console.log("Admin     : admin@yayasan.com / password");
  console.log("Pegawai   : guru1@yayasan.com / password");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
