import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Employee {
  id: number
  user_id: number
  first_name: string
  last_name: string
  employee_id: string
  department: string
  position: string
  hire_date: string
  annual_leave_days: number
  sick_leave_days: number
  email: string
}

export interface LeaveRequest {
  id: number
  employee_id: number
  leave_type_id: number
  start_date: string
  end_date: string
  days_requested: number
  reason: string
  status: "pending" | "approved" | "rejected"
  admin_comments?: string
  approved_by?: number
  approved_at?: string
  created_at: string
  employee_name: string
  leave_type_name: string
}

export interface LeaveType {
  id: number
  name: string
  description: string
  max_days_per_year: number
}

export async function getEmployeeByUserId(userId: number): Promise<Employee | null> {
  const result = await sql`
    SELECT e.*, u.email 
    FROM employees e 
    JOIN users u ON e.user_id = u.id 
    WHERE e.user_id = ${userId}
  `
  return result[0] || null
}

export async function getAllEmployees(): Promise<Employee[]> {
  const result = await sql`
    SELECT e.*, u.email 
    FROM employees e 
    JOIN users u ON e.user_id = u.id 
    ORDER BY e.first_name, e.last_name
  `
  return result as Employee[]
}

export async function getLeaveRequests(employeeId?: number): Promise<LeaveRequest[]> {
  const query = employeeId
    ? sql`
        SELECT lr.*, 
               CONCAT(e.first_name, ' ', e.last_name) as employee_name,
               lt.name as leave_type_name
        FROM leave_requests lr
        JOIN employees e ON lr.employee_id = e.id
        JOIN leave_types lt ON lr.leave_type_id = lt.id
        WHERE lr.employee_id = ${employeeId}
        ORDER BY lr.created_at DESC
      `
    : sql`
        SELECT lr.*, 
               CONCAT(e.first_name, ' ', e.last_name) as employee_name,
               lt.name as leave_type_name
        FROM leave_requests lr
        JOIN employees e ON lr.employee_id = e.id
        JOIN leave_types lt ON lr.leave_type_id = lt.id
        ORDER BY lr.created_at DESC
      `

  const result = await query
  return result as LeaveRequest[]
}

export async function getLeaveTypes(): Promise<LeaveType[]> {
  const result = await sql`SELECT * FROM leave_types ORDER BY name`
  return result as LeaveType[]
}

export async function createLeaveRequest(data: {
  employee_id: number
  leave_type_id: number
  start_date: string
  end_date: string
  days_requested: number
  reason: string
}) {
  const result = await sql`
    INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, days_requested, reason)
    VALUES (${data.employee_id}, ${data.leave_type_id}, ${data.start_date}, ${data.end_date}, ${data.days_requested}, ${data.reason})
    RETURNING *
  `
  return result[0]
}

export async function updateLeaveRequestStatus(
  requestId: number,
  status: "approved" | "rejected",
  adminComments?: string,
  approvedBy?: number,
) {
  const result = await sql`
    UPDATE leave_requests 
    SET status = ${status}, 
        admin_comments = ${adminComments || null},
        approved_by = ${approvedBy || null},
        approved_at = ${status === "approved" ? new Date().toISOString() : null},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${requestId}
    RETURNING *
  `
  return result[0]
}

export async function getLeaveStats(employeeId?: number) {
  if (employeeId) {
    const result = await sql`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_requests,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_requests,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN days_requested ELSE 0 END), 0) as total_days_taken
      FROM leave_requests 
      WHERE employee_id = ${employeeId}
    `
    return result[0]
  } else {
    const result = await sql`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_requests,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_requests,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN days_requested ELSE 0 END), 0) as total_days_taken
      FROM leave_requests
    `
    return result[0]
  }
}

export default sql
