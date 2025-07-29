import mysql from "mysql2/promise";

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "employee_leave_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Only test connection if not in Edge Runtime
if (typeof process !== "undefined" && process.versions?.node) {
  pool
    .getConnection()
    .then((connection) => {
      console.log("✅ Connected to MySQL database");
      connection.release();
    })
    .catch((error) => {
      console.error("❌ MySQL connection failed:", error);
    });
}

// Helper function to execute queries
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("❌ Database query error:", error);
    throw error;
  }
}

// Interfaces
export interface Lembaga {
  id: number;
  nama: string;
  alamat?: string;
  telepon?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  lembaga_id?: number;
  nama: string;
  email: string;
  password: string;
  role: "superadmin" | "admin" | "karyawan";
  jabatan?: string;
  tanggal_masuk?: string;
  created_at: string;
  updated_at: string;
  lembaga_nama?: string;
}

export interface JenisCuti {
  id: number;
  nama_izin: string;
  maksimal_hari_per_tahun: number;
  keterangan?: string;
  perlu_dokumen: boolean;
  approval_berjenjang: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cuti {
  id: number;
  user_id: number;
  jenis_cuti_id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan: string;
  status: "pending" | "dalam_proses" | "disetujui" | "ditolak";
  approval_terakhir_level: number;
  catatan_admin?: string;
  dicatat_oleh?: number;
  disetujui_oleh?: number;
  dokumen?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_nama?: string;
  jenis_cuti_nama?: string;
  lembaga_nama?: string;
  days_requested?: number;
}

export interface CutiKuota {
  id: number;
  user_id: number;
  jenis_cuti_id: number;
  tahun: number;
  jatah_total: number;
  jatah_terpakai: number;
  jenis_cuti_nama?: string;
}

export interface CutiApprovalFlow {
  id: number;
  lembaga_id: number;
  jenis_cuti_id: number;
  level: number;
  approver_id: number;
  batas_waktu_approval: number;
  dibuat_oleh?: number;
  created_at: string;
  approver_nama?: string;
  jenis_cuti_nama?: string;
  lembaga_nama?: string;
}

export interface CutiApprovalLog {
  id: number;
  cuti_id: number;
  approver_id: number;
  level: number;
  status: "pending" | "approved" | "rejected" | "auto_approved";
  catatan?: string;
  tanggal_approval?: string;
  batas_waktu_approval?: string;
  created_at: string;
  approver_nama?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  pesan: string;
  dibaca: boolean;
  created_at: string;
}

// User functions
export async function getUserByEmail(email: string): Promise<User | null> {
  const results = (await query(
    `
    SELECT u.*, l.nama as lembaga_nama 
    FROM users u 
    LEFT JOIN lembaga l ON u.lembaga_id = l.id 
    WHERE u.email = ?
  `,
    [email]
  )) as User[];

  return results[0] || null;
}

export async function getUserById(id: number): Promise<User | null> {
  const results = (await query(
    `
    SELECT u.*, l.nama as lembaga_nama 
    FROM users u 
    LEFT JOIN lembaga l ON u.lembaga_id = l.id 
    WHERE u.id = ?
  `,
    [id]
  )) as User[];

  return results[0] || null;
}

export async function getAllUsers(): Promise<User[]> {
  const results = (await query(`
    SELECT u.*, l.nama as lembaga_nama 
    FROM users u 
    LEFT JOIN lembaga l ON u.lembaga_id = l.id 
    ORDER BY u.nama
  `)) as User[];

  return results;
}

export async function getUsersByLembaga(lembagaId: number): Promise<User[]> {
  const results = (await query(
    `
    SELECT u.*, l.nama as lembaga_nama 
    FROM users u 
    LEFT JOIN lembaga l ON u.lembaga_id = l.id 
    WHERE u.lembaga_id = ?
    ORDER BY u.nama
  `,
    [lembagaId]
  )) as User[];

  return results;
}

export async function createUser(userData: {
  lembaga_id?: number;
  nama: string;
  email: string;
  password: string;
  role: string;
  jabatan?: string;
  tanggal_masuk?: string;
}): Promise<User> {
  const result = (await query(
    `
    INSERT INTO users (lembaga_id, nama, email, password, role, jabatan, tanggal_masuk)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [
      userData.lembaga_id || null,
      userData.nama,
      userData.email,
      userData.password,
      userData.role,
      userData.jabatan || null,
      userData.tanggal_masuk || null,
    ]
  )) as any;

  // Get the created user
  const user = await getUserById(result.insertId);
  if (!user) {
    throw new Error("Failed to fetch created user");
  }
  return user;
}

// Lembaga functions
export async function getAllLembaga(): Promise<Lembaga[]> {
  const results = (await query(
    `SELECT * FROM lembaga ORDER BY nama`
  )) as Lembaga[];
  return results;
}

export async function getLembagaById(id: number): Promise<Lembaga | null> {
  const results = (await query(`SELECT * FROM lembaga WHERE id = ?`, [
    id,
  ])) as Lembaga[];
  return results[0] || null;
}

export async function createLembaga(data: {
  nama: string;
  alamat?: string;
  telepon?: string;
}): Promise<Lembaga> {
  const result = (await query(
    `
    INSERT INTO lembaga (nama, alamat, telepon)
    VALUES (?, ?, ?)
  `,
    [data.nama, data.alamat || null, data.telepon || null]
  )) as any;

  const lembaga = await getLembagaById(result.insertId);
  if (!lembaga) {
    throw new Error("Failed to fetch created lembaga");
  }
  return lembaga;
}

// Jenis Cuti functions
export async function getAllJenisCuti(): Promise<JenisCuti[]> {
  const results = (await query(
    `SELECT * FROM jenis_cuti ORDER BY nama_izin`
  )) as JenisCuti[];
  return results;
}

export async function getJenisCutiById(id: number): Promise<JenisCuti | null> {
  const results = (await query(`SELECT * FROM jenis_cuti WHERE id = ?`, [
    id,
  ])) as JenisCuti[];
  return results[0] || null;
}

export async function createJenisCuti(data: {
  nama_izin: string;
  maksimal_hari_per_tahun: number;
  keterangan?: string;
  perlu_dokumen: boolean;
  approval_berjenjang: boolean;
}): Promise<JenisCuti> {
  const result = (await query(
    `
    INSERT INTO jenis_cuti (nama_izin, maksimal_hari_per_tahun, keterangan, perlu_dokumen, approval_berjenjang)
    VALUES (?, ?, ?, ?, ?)
  `,
    [
      data.nama_izin,
      data.maksimal_hari_per_tahun,
      data.keterangan || null,
      data.perlu_dokumen,
      data.approval_berjenjang,
    ]
  )) as any;

  const jenisCuti = await getJenisCutiById(result.insertId);
  if (!jenisCuti) {
    throw new Error("Failed to fetch created jenis cuti");
  }
  return jenisCuti;
}

// Cuti functions
export async function getCutiByUserId(userId: number): Promise<Cuti[]> {
  const results = (await query(
    `
    SELECT c.*, 
           u.nama as user_nama,
           jc.nama_izin as jenis_cuti_nama,
           l.nama as lembaga_nama,
           DATEDIFF(c.tanggal_selesai, c.tanggal_mulai) + 1 as days_requested
    FROM cuti c
    JOIN users u ON c.user_id = u.id
    JOIN jenis_cuti jc ON c.jenis_cuti_id = jc.id
    LEFT JOIN lembaga l ON u.lembaga_id = l.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `,
    [userId]
  )) as Cuti[];

  return results;
}

export async function getAllCuti(): Promise<Cuti[]> {
  const results = (await query(`
    SELECT c.*, 
           u.nama as user_nama,
           jc.nama_izin as jenis_cuti_nama,
           l.nama as lembaga_nama,
           DATEDIFF(c.tanggal_selesai, c.tanggal_mulai) + 1 as days_requested
    FROM cuti c
    JOIN users u ON c.user_id = u.id
    JOIN jenis_cuti jc ON c.jenis_cuti_id = jc.id
    LEFT JOIN lembaga l ON u.lembaga_id = l.id
    ORDER BY c.created_at DESC
  `)) as Cuti[];

  return results;
}

export async function getCutiById(id: number): Promise<Cuti | null> {
  const results = (await query(
    `
    SELECT c.*, 
           u.nama as user_nama,
           jc.nama_izin as jenis_cuti_nama,
           l.nama as lembaga_nama,
           DATEDIFF(c.tanggal_selesai, c.tanggal_mulai) + 1 as days_requested
    FROM cuti c
    JOIN users u ON c.user_id = u.id
    JOIN jenis_cuti jc ON c.jenis_cuti_id = jc.id
    LEFT JOIN lembaga l ON u.lembaga_id = l.id
    WHERE c.id = ?
  `,
    [id]
  )) as Cuti[];

  return results[0] || null;
}

export async function createCuti(data: {
  user_id: number;
  jenis_cuti_id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan: string;
  dokumen?: string;
}): Promise<Cuti> {
  const result = (await query(
    `
    INSERT INTO cuti (user_id, jenis_cuti_id, tanggal_mulai, tanggal_selesai, alasan, dokumen)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [
      data.user_id,
      data.jenis_cuti_id,
      data.tanggal_mulai,
      data.tanggal_selesai,
      data.alasan,
      data.dokumen || null,
    ]
  )) as any;

  const cuti = await getCutiById(result.insertId);
  if (!cuti) {
    throw new Error("Failed to fetch created cuti");
  }
  return cuti;
}

export async function updateCutiStatus(
  id: number,
  status: string,
  catatan_admin?: string,
  disetujui_oleh?: number
): Promise<Cuti> {
  await query(
    `
    UPDATE cuti 
    SET status = ?, 
        catatan_admin = ?,
        disetujui_oleh = ?,
        updated_at = NOW()
    WHERE id = ?
  `,
    [status, catatan_admin || null, disetujui_oleh || null, id]
  );

  const cuti = await getCutiById(id);
  if (!cuti) {
    throw new Error("Failed to fetch updated cuti");
  }
  return cuti;
}

// Kuota functions
export async function getCutiKuotaByUser(
  userId: number,
  tahun: number = new Date().getFullYear()
): Promise<CutiKuota[]> {
  const results = (await query(
    `
    SELECT ck.*, jc.nama_izin as jenis_cuti_nama
    FROM cuti_kuota ck
    JOIN jenis_cuti jc ON ck.jenis_cuti_id = jc.id
    WHERE ck.user_id = ? AND ck.tahun = ?
    ORDER BY jc.nama_izin
  `,
    [userId, tahun]
  )) as CutiKuota[];

  return results;
}

export async function updateCutiKuota(
  userId: number,
  jenisCutiId: number,
  tahun: number,
  jatahTerpakai: number
): Promise<void> {
  await query(
    `
    UPDATE cuti_kuota 
    SET jatah_terpakai = jatah_terpakai + ?
    WHERE user_id = ? AND jenis_cuti_id = ? AND tahun = ?
  `,
    [jatahTerpakai, userId, jenisCutiId, tahun]
  );
}

// Approval Flow functions
export async function getApprovalFlow(
  lembagaId: number,
  jenisCutiId: number
): Promise<CutiApprovalFlow[]> {
  const results = (await query(
    `
    SELECT caf.*, 
           u.nama as approver_nama,
           jc.nama_izin as jenis_cuti_nama,
           l.nama as lembaga_nama
    FROM cuti_approval_flow caf
    JOIN users u ON caf.approver_id = u.id
    JOIN jenis_cuti jc ON caf.jenis_cuti_id = jc.id
    JOIN lembaga l ON caf.lembaga_id = l.id
    WHERE caf.lembaga_id = ? AND caf.jenis_cuti_id = ?
    ORDER BY caf.level
  `,
    [lembagaId, jenisCutiId]
  )) as CutiApprovalFlow[];

  return results;
}

export async function getAllApprovalFlows(): Promise<CutiApprovalFlow[]> {
  const results = (await query(`
    SELECT caf.*, 
           u.nama as approver_nama,
           jc.nama_izin as jenis_cuti_nama,
           l.nama as lembaga_nama
    FROM cuti_approval_flow caf
    JOIN users u ON caf.approver_id = u.id
    JOIN jenis_cuti jc ON caf.jenis_cuti_id = jc.id
    JOIN lembaga l ON caf.lembaga_id = l.id
    ORDER BY caf.lembaga_id, caf.jenis_cuti_id, caf.level
  `)) as CutiApprovalFlow[];

  return results;
}

export async function createApprovalFlow(data: {
  lembaga_id: number;
  jenis_cuti_id: number;
  level: number;
  approver_id: number;
  batas_waktu_approval: number;
  dibuat_oleh: number;
}): Promise<CutiApprovalFlow> {
  const result = (await query(
    `
    INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [
      data.lembaga_id,
      data.jenis_cuti_id,
      data.level,
      data.approver_id,
      data.batas_waktu_approval,
      data.dibuat_oleh,
    ]
  )) as any;

  const flows = (await query(
    `
    SELECT caf.*, 
           u.nama as approver_nama,
           jc.nama_izin as jenis_cuti_nama,
           l.nama as lembaga_nama
    FROM cuti_approval_flow caf
    JOIN users u ON caf.approver_id = u.id
    JOIN jenis_cuti jc ON caf.jenis_cuti_id = jc.id
    JOIN lembaga l ON caf.lembaga_id = l.id
    WHERE caf.id = ?
  `,
    [result.insertId]
  )) as CutiApprovalFlow[];

  return flows[0];
}

// Approval Log functions
export async function createApprovalLogs(
  cutiId: number,
  approvalFlows: CutiApprovalFlow[]
): Promise<void> {
  for (const flow of approvalFlows) {
    const batasWaktu = new Date();
    batasWaktu.setDate(batasWaktu.getDate() + flow.batas_waktu_approval);

    await query(
      `
      INSERT INTO cuti_approval_log (cuti_id, approver_id, level, batas_waktu_approval)
      VALUES (?, ?, ?, ?)
    `,
      [cutiId, flow.approver_id, flow.level, batasWaktu.toISOString()]
    );
  }
}

export async function getApprovalLogsByCuti(
  cutiId: number
): Promise<CutiApprovalLog[]> {
  const results = (await query(
    `
    SELECT cal.*, u.nama as approver_nama
    FROM cuti_approval_log cal
    JOIN users u ON cal.approver_id = u.id
    WHERE cal.cuti_id = ?
    ORDER BY cal.level
  `,
    [cutiId]
  )) as CutiApprovalLog[];

  return results;
}

export async function updateApprovalLog(
  cutiId: number,
  level: number,
  status: string,
  catatan?: string
): Promise<CutiApprovalLog> {
  await query(
    `
    UPDATE cuti_approval_log 
    SET status = ?, 
        catatan = ?,
        tanggal_approval = NOW()
    WHERE cuti_id = ? AND level = ?
  `,
    [status, catatan || null, cutiId, level]
  );

  const results = (await query(
    `
    SELECT cal.*, u.nama as approver_nama
    FROM cuti_approval_log cal
    JOIN users u ON cal.approver_id = u.id
    WHERE cal.cuti_id = ? AND cal.level = ?
  `,
    [cutiId, level]
  )) as CutiApprovalLog[];

  return results[0];
}

export async function getPendingApprovalsByUser(
  userId: number
): Promise<Cuti[]> {
  const results = (await query(
    `
    SELECT DISTINCT c.*, 
           u.nama as user_nama,
           jc.nama_izin as jenis_cuti_nama,
           l.nama as lembaga_nama,
           DATEDIFF(c.tanggal_selesai, c.tanggal_mulai) + 1 as days_requested
    FROM cuti c
    JOIN users u ON c.user_id = u.id
    JOIN jenis_cuti jc ON c.jenis_cuti_id = jc.id
    LEFT JOIN lembaga l ON u.lembaga_id = l.id
    JOIN cuti_approval_log cal ON c.id = cal.cuti_id
    WHERE cal.approver_id = ? 
      AND cal.status = 'pending'
      AND c.status IN ('pending', 'dalam_proses')
    ORDER BY c.created_at DESC
  `,
    [userId]
  )) as Cuti[];

  return results;
}

// Notification functions
export async function createNotification(
  userId: number,
  pesan: string
): Promise<Notification> {
  const result = (await query(
    `
    INSERT INTO notifications (user_id, pesan)
    VALUES (?, ?)
  `,
    [userId, pesan]
  )) as any;

  const notifications = (await query(
    `
    SELECT * FROM notifications WHERE id = ?
  `,
    [result.insertId]
  )) as Notification[];

  return notifications[0];
}

export async function getNotificationsByUser(
  userId: number
): Promise<Notification[]> {
  const results = (await query(
    `
    SELECT * FROM notifications 
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `,
    [userId]
  )) as Notification[];

  return results;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await query(
    `
    UPDATE notifications 
    SET dibaca = TRUE 
    WHERE id = ?
  `,
    [id]
  );
}

// Statistics functions
export async function getCutiStats(lembagaId?: number) {
  let sql = `
    SELECT 
      COUNT(*) as total_requests,
      COUNT(CASE WHEN c.status = 'pending' THEN 1 END) as pending_requests,
      COUNT(CASE WHEN c.status = 'dalam_proses' THEN 1 END) as dalam_proses_requests,
      COUNT(CASE WHEN c.status = 'disetujui' THEN 1 END) as approved_requests,
      COUNT(CASE WHEN c.status = 'ditolak' THEN 1 END) as rejected_requests,
      COALESCE(SUM(CASE WHEN c.status = 'disetujui' THEN DATEDIFF(c.tanggal_selesai, c.tanggal_mulai) + 1 ELSE 0 END), 0) as total_days_approved
    FROM cuti c
    JOIN users u ON c.user_id = u.id
  `;

  const params = [];
  if (lembagaId) {
    sql += ` WHERE u.lembaga_id = ?`;
    params.push(lembagaId);
  }

  const results = (await query(sql, params)) as any[];
  return results[0];
}

export default pool;
