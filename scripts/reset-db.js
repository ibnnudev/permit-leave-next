const mysql = require("mysql2/promise")
require("dotenv").config({ path: ".env.local" })

// Set true jika ingin mematikan pemeriksaan foreign key
const DISABLE_FOREIGN_KEY_CHECKS = true

async function resetDatabase() {
    let connection

    try {
        console.log("🔄 Connecting to MySQL...")

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: Number.parseInt(process.env.DB_PORT || "3306"),
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "employee_leave_db",
        })

        console.log("✅ Connected to MySQL database")
        console.log("🔄 Resetting database...")

        if (DISABLE_FOREIGN_KEY_CHECKS) {
            await connection.execute("SET FOREIGN_KEY_CHECKS = 0")
        }

        const dropTablesInOrder = [
            // Tabel yang tergantung pada users, jenis_cuti
            "leave_requests",
            "kuota_cuti",

            // Master data
            "jenis_cuti",
            "users",

            // Tambahan tabel jika ada di strukturmu nanti
            "cuti_approval_log",
            "cuti_approval_flow",
            "notifications",
            "lembaga",
        ]

        for (const table of dropTablesInOrder) {
            const sql = `DROP TABLE IF EXISTS \`${table}\``
            await connection.execute(sql)
            console.log(`🗑️  Dropped table: ${table}`)
        }

        if (DISABLE_FOREIGN_KEY_CHECKS) {
            await connection.execute("SET FOREIGN_KEY_CHECKS = 1")
        }

        console.log("✅ All tables dropped successfully")
        console.log("🎉 Database reset completed!")
        console.log('💡 Run "bun run db:setup" to recreate tables and seed data')

    } catch (error) {
        console.error("❌ Error resetting database:", error)
        process.exit(1)
    } finally {
        if (connection) await connection.end()
    }
}

resetDatabase()
