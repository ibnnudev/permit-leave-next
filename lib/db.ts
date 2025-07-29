import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "employee_leave_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("✅ Database connected successfully")
    connection.release()
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// User-related database functions
export async function getUserByEmail(email: string) {
  try {
    const [rows] = await pool.execute(
      `SELECT u.*, l.nama as lembaga_nama 
       FROM users u 
       LEFT JOIN lembaga l ON u.lembaga_id = l.id 
       WHERE u.email = ?`,
      [email],
    )
    const users = rows as any[]
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUserById(id: number) {
  try {
    const [rows] = await pool.execute(
      `SELECT u.*, l.nama as lembaga_nama 
       FROM users u 
       LEFT JOIN lembaga l ON u.lembaga_id = l.id 
       WHERE u.id = ?`,
      [id],
    )
    const users = rows as any[]
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function getAllUsers() {
  try {
    const [rows] = await pool.execute(
      `SELECT u.*, l.nama as lembaga_nama 
       FROM users u 
       LEFT JOIN lembaga l ON u.lembaga_id = l.id 
       ORDER BY u.nama`,
    )
    return rows as any[]
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

// Leave request functions
export async function getLeaveRequests(userId?: number, lembagaId?: number) {
  try {
    let query = `
      SELECT cr.*, u.nama as user_nama, jc.nama as jenis_nama, l.nama as lembaga_nama
      FROM cuti_requests cr
      JOIN users u ON cr.user_id = u.id
      JOIN jenis_cuti jc ON cr.jenis_cuti_id = jc.id
      LEFT JOIN lembaga l ON u.lembaga_id = l.id
    `
    const params: any[] = []

    if (userId) {
      query += " WHERE cr.user_id = ?"
      params.push(userId)
    } else if (lembagaId) {
      query += " WHERE u.lembaga_id = ?"
      params.push(lembagaId)
    }

    query += " ORDER BY cr.created_at DESC"

    const [rows] = await pool.execute(query, params)
    return rows as any[]
  } catch (error) {
    console.error("Error getting leave requests:", error)
    return []
  }
}

export async function getLeaveRequestById(id: number) {
  try {
    const [rows] = await pool.execute(
      `SELECT cr.*, u.nama as user_nama, u.email as user_email, 
              jc.nama as jenis_nama, l.nama as lembaga_nama
       FROM cuti_requests cr
       JOIN users u ON cr.user_id = u.id
       JOIN jenis_cuti jc ON cr.jenis_cuti_id = jc.id
       LEFT JOIN lembaga l ON u.lembaga_id = l.id
       WHERE cr.id = ?`,
      [id],
    )
    const requests = rows as any[]
    return requests.length > 0 ? requests[0] : null
  } catch (error) {
    console.error("Error getting leave request by ID:", error)
    return null
  }
}

export async function createLeaveRequest(data: {
  user_id: number
  jenis_cuti_id: number
  tanggal_mulai: string
  tanggal_selesai: string
  jumlah_hari: number
  keterangan?: string
}) {
  try {
    const [result] = await pool.execute(
      `INSERT INTO cuti_requests (user_id, jenis_cuti_id, tanggal_mulai, tanggal_selesai, jumlah_hari, keterangan, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        data.user_id,
        data.jenis_cuti_id,
        data.tanggal_mulai,
        data.tanggal_selesai,
        data.jumlah_hari,
        data.keterangan || "",
      ],
    )
    return result as any
  } catch (error) {
    console.error("Error creating leave request:", error)
    throw error
  }
}

export async function updateLeaveRequestStatus(id: number, status: string, keterangan_admin?: string) {
  try {
    const [result] = await pool.execute(
      `UPDATE cuti_requests 
       SET status = ?, keterangan_admin = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, keterangan_admin || "", id],
    )
    return result as any
  } catch (error) {
    console.error("Error updating leave request status:", error)
    throw error
  }
}

// Leave types functions
export async function getLeaveTypes() {
  try {
    const [rows] = await pool.execute("SELECT * FROM jenis_cuti ORDER BY nama")
    return rows as any[]
  } catch (error) {
    console.error("Error getting leave types:", error)
    return []
  }
}

// Leave quota functions
export async function getLeaveQuota(userId: number, jenisId: number, year: number) {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM kuota_cuti 
       WHERE user_id = ? AND jenis_cuti_id = ? AND tahun = ?`,
      [userId, jenisId, year],
    )
    const quotas = rows as any[]
    return quotas.length > 0 ? quotas[0] : null
  } catch (error) {
    console.error("Error getting leave quota:", error)
    return null
  }
}

export async function getUserLeaveQuotas(userId: number, year: number) {
  try {
    const [rows] = await pool.execute(
      `SELECT kc.*, jc.nama as jenis_nama
       FROM kuota_cuti kc
       JOIN jenis_cuti jc ON kc.jenis_cuti_id = jc.id
       WHERE kc.user_id = ? AND kc.tahun = ?`,
      [userId, year],
    )
    return rows as any[]
  } catch (error) {
    console.error("Error getting user leave quotas:", error)
    return []
  }
}

// Dashboard stats functions
export async function getDashboardStats(lembagaId?: number) {
  try {
    let whereClause = ""
    const params: any[] = []

    if (lembagaId) {
      whereClause = "WHERE u.lembaga_id = ?"
      params.push(lembagaId)
    }

    const [totalEmployees] = await pool.execute(`SELECT COUNT(*) as count FROM users u ${whereClause}`, params)

    const [pendingRequests] = await pool.execute(
      `SELECT COUNT(*) as count FROM cuti_requests cr
       JOIN users u ON cr.user_id = u.id
       ${whereClause} ${lembagaId ? "AND" : "WHERE"} cr.status = 'pending'`,
      lembagaId ? [...params, "pending"] : ["pending"],
    )

    const [approvedRequests] = await pool.execute(
      `SELECT COUNT(*) as count FROM cuti_requests cr
       JOIN users u ON cr.user_id = u.id
       ${whereClause} ${lembagaId ? "AND" : "WHERE"} cr.status = 'approved'`,
      lembagaId ? [...params, "approved"] : ["approved"],
    )

    const [rejectedRequests] = await pool.execute(
      `SELECT COUNT(*) as count FROM cuti_requests cr
       JOIN users u ON cr.user_id = u.id
       ${whereClause} ${lembagaId ? "AND" : "WHERE"} cr.status = 'rejected'`,
      lembagaId ? [...params, "rejected"] : ["rejected"],
    )

    return {
      totalEmployees: (totalEmployees as any[])[0].count,
      pendingRequests: (pendingRequests as any[])[0].count,
      approvedRequests: (approvedRequests as any[])[0].count,
      rejectedRequests: (rejectedRequests as any[])[0].count,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalEmployees: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
    }
  }
}

export default pool
