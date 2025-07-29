// Alternative database connection using node-postgres (pg)
// Use this if you prefer pg over neon for local development

import { Pool, type PoolClient } from "pg"
import type { User } from "./path-to-user-interface" // Declare the User interface

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Additional configuration for local development
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } finally {
    client.release()
  }
}

// Helper function for transactions
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// All your existing interfaces remain the same...
export interface Lembaga {
  id: number
  nama: string
  alamat?: string
  telepon?: string
  created_at: string
  updated_at: string
}

// ... (keep all existing interfaces)

// Example of how to modify functions to use pg instead of neon:
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    `
    SELECT u.*, l.nama as lembaga_nama 
    FROM users u 
    LEFT JOIN lembaga l ON u.lembaga_id = l.id 
    WHERE u.email = $1
  `,
    [email],
  )

  return result[0] || null
}

export async function getAllUsers(): Promise<User[]> {
  const result = await query(`
    SELECT u.*, l.nama as lembaga_nama 
    FROM users u 
    LEFT JOIN lembaga l ON u.lembaga_id = l.id 
    ORDER BY u.nama
  `)

  return result as User[]
}

// Continue with all other functions...
// Replace sql`...` with query('...', [params]) format

export default pool
