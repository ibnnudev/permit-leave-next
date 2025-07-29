import mysql from "mysql2/promise";
import { PrismaClient, StatusCuti } from "@prisma/client";
const prisma = new PrismaClient();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "employee_leave_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// User functions
export async function getUserByEmail(email: string) {
  const sql = "SELECT * FROM users WHERE email = ?";
  const results = (await query(sql, [email])) as any[];
  return results[0] || null;
}

export async function getUserById(id: number) {
  const user = await prisma.pegawai.findFirst({
    where: { id },
    include: { lembaga: true },
  });
  return user;
}

export async function getAllUsers() {
  const users = await prisma.pegawai.findMany({
    include: { lembaga: true },
  });
  return users;
}

// Leave request functions
export async function getLeaveRequests(userId?: number) {
  return await prisma.cuti.findMany({
    include: {
      pegawai: true,
      jenisCuti: true,
    },
  });
}

export async function getLeaveRequestById(id: number) {
  return await prisma.cuti.findFirst({
    where: { id },
    include: {
      pegawai: true,
      jenisCuti: true,
    },
  });
}

export async function createLeaveRequest(data: {
  user_id: number;
  jenis_cuti_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
}) {
  return await prisma.cuti.create({
    data: {
      pegawai_id: data.user_id,
      jenis_cuti_id: data.jenis_cuti_id,
      tanggal_mulai: data.start_date,
      tanggal_selesai: data.end_date,
      alasan: data.reason,
      status: "PENDING",
      level_terakhir_diproses: 0,
    },
  });
}

export async function updateLeaveRequestStatus(
  id: number,
  status: string,
  reviewedBy?: number,
  reviewNotes?: string
) {
  return await prisma.cuti.update({
    where: { id },
    data: {
      status: StatusCuti[status.toUpperCase() as keyof typeof StatusCuti],
      disetujui_oleh_id: reviewedBy,
      catatan_admin: reviewNotes,
      diperbarui_pada: new Date(),
    },
  });
}

// Leave types functions
export async function getLeaveTypes() {
  const result = await prisma.jenisCuti.findMany();
  return result;
}

export async function getLeaveTypeById(id: number) {
  const result = await prisma.jenisCuti.findFirst({
    where: { id },
  });
  return result;
}

// Quota functions
export async function getUserQuota(userId: number, year: number) {
  const result = await prisma.kuotaCuti.findFirst({
    where: {
      pegawai_id: userId,
      tahun: year,
    },
  });
  return result;
}

export async function createUserQuota(data: {
  user_id: number;
  jenis_cuti_id: number;
  year: number;
  total_quota: number;
  used_quota?: number;
}) {
  return await prisma.kuotaCuti.create({
    data: {
      pegawai_id: data.user_id,
      jenis_cuti_id: data.jenis_cuti_id,
      tahun: data.year,
      jatah_total: data.total_quota,
      jatah_terpakai: data.used_quota || 0,
    },
  });
}

export async function updateUserQuota(
  userId: number,
  year: number,
  usedQuota: number
) {
  const sql =
    "UPDATE kuota_cuti SET used_quota = ? WHERE user_id = ? AND year = ?";
  return await query(sql, [usedQuota, userId, year]);
}

// Dashboard statistics
export async function getDashboardStats() {
  const totalEmployees = await query(
    'SELECT COUNT(*) as count FROM users WHERE role = "employee"'
  );
  const pendingRequests = await query(
    'SELECT COUNT(*) as count FROM leave_requests WHERE status = "pending"'
  );
  const approvedRequests = await query(
    'SELECT COUNT(*) as count FROM leave_requests WHERE status = "approved"'
  );
  const rejectedRequests = await query(
    'SELECT COUNT(*) as count FROM leave_requests WHERE status = "rejected"'
  );

  return {
    totalEmployees: (totalEmployees as any[])[0].count,
    pendingRequests: (pendingRequests as any[])[0].count,
    approvedRequests: (approvedRequests as any[])[0].count,
    rejectedRequests: (rejectedRequests as any[])[0].count,
  };
}

export async function getRecentLeaveRequests(limit = 5) {
  const sql = `
    SELECT lr.*, u.name as user_name, jc.nama as jenis_cuti_nama
    FROM leave_requests lr
    JOIN users u ON lr.user_id = u.id
    JOIN jenis_cuti jc ON lr.jenis_cuti_id = jc.id
    ORDER BY lr.created_at DESC
    LIMIT ?
  `;
  return await query(sql, [limit]);
}

export async function getLeaveStats() {
  const [pending, approved, rejected, totalDays] = await Promise.all([
    query(
      'SELECT COUNT(*) as count FROM leave_requests WHERE status = "pending"'
    ),
    query(
      'SELECT COUNT(*) as count FROM leave_requests WHERE status = "approved"'
    ),
    query(
      'SELECT COUNT(*) as count FROM leave_requests WHERE status = "rejected"'
    ),
    query(
      'SELECT IFNULL(SUM(total_days), 0) as total FROM leave_requests WHERE status = "approved"'
    ),
  ]);

  return {
    pending_requests: (pending as any[])[0].count,
    approved_requests: (approved as any[])[0].count,
    rejected_requests: (rejected as any[])[0].count,
    total_days_taken: (totalDays as any[])[0].total,
  };
}

export async function getAllEmployees() {
  const sql = `SELECT id, name, email, department, created_at FROM users WHERE role = "employee" ORDER BY created_at DESC`;
  return await query(sql);
}

export default pool;
