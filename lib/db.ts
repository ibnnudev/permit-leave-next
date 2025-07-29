import { PrismaClient } from "@/generated/prisma";
import mysql from "mysql2/promise";

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
  const sql = "SELECT * FROM users WHERE id = ?";
  const results = (await query(sql, [id])) as any[];
  return results[0] || null;
}

export async function getAllUsers() {
  const sql =
    "SELECT id, name, email, role, department, created_at FROM users ORDER BY created_at DESC";
  return await query(sql);
}

// Leave request functions
export async function getLeaveRequests(userId?: number) {
  let sql = `
    SELECT lr.*, u.name as user_name, u.email as user_email, 
           jc.nama as jenis_cuti_nama, jc.max_days
    FROM leave_requests lr
    JOIN users u ON lr.user_id = u.id
    JOIN jenis_cuti jc ON lr.jenis_cuti_id = jc.id
  `;

  const params: any[] = [];
  if (userId) {
    sql += " WHERE lr.user_id = ?";
    params.push(userId);
  }

  sql += " ORDER BY lr.created_at DESC";
  return await query(sql, params);
}

export async function getLeaveRequestById(id: number) {
  const sql = `
    SELECT lr.*, u.name as user_name, u.email as user_email,
           jc.nama as jenis_cuti_nama, jc.max_days
    FROM leave_requests lr
    JOIN users u ON lr.user_id = u.id
    JOIN jenis_cuti jc ON lr.jenis_cuti_id = jc.id
    WHERE lr.id = ?
  `;
  const results = (await query(sql, [id])) as any[];
  return results[0] || null;
}

export async function createLeaveRequest(data: {
  user_id: number;
  jenis_cuti_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
}) {
  const sql = `
    INSERT INTO leave_requests (user_id, jenis_cuti_id, start_date, end_date, total_days, reason, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `;
  const params = [
    data.user_id,
    data.jenis_cuti_id,
    data.start_date,
    data.end_date,
    data.total_days,
    data.reason,
  ];
  return await query(sql, params);
}

export async function updateLeaveRequestStatus(
  id: number,
  status: string,
  reviewedBy?: number,
  reviewNotes?: string
) {
  const sql = `
    UPDATE leave_requests 
    SET status = ?, reviewed_by = ?, review_notes = ?, reviewed_at = NOW()
    WHERE id = ?
  `;
  return await query(sql, [status, reviewedBy, reviewNotes, id]);
}

// Leave types functions
export async function getLeaveTypes() {
  const sql = "SELECT * FROM jenis_cuti ORDER BY nama";
  return await query(sql);
}

export async function getLeaveTypeById(id: number) {
  const sql = "SELECT * FROM jenis_cuti WHERE id = ?";
  const results = (await query(sql, [id])) as any[];
  return results[0] || null;
}

// Quota functions
export async function getUserQuota(userId: number, year: number) {
  const sql = "SELECT * FROM kuota_cuti WHERE user_id = ? AND year = ?";
  const results = (await query(sql, [userId, year])) as any[];
  return results[0] || null;
}

export async function createUserQuota(data: {
  user_id: number;
  year: number;
  total_quota: number;
  used_quota?: number;
}) {
  const sql = `
    INSERT INTO kuota_cuti (user_id, year, total_quota, used_quota)
    VALUES (?, ?, ?, ?)
  `;
  return await query(sql, [
    data.user_id,
    data.year,
    data.total_quota,
    data.used_quota || 0,
  ]);
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
