const mysql = require("mysql2/promise")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

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

    // Drop all tables in correct order (reverse of creation)
    const dropTablesSQL = `
      DROP TABLE IF EXISTS notifications;
      DROP TABLE IF EXISTS cuti_approval_log;
      DROP TABLE IF EXISTS cuti_approval_flow;
      DROP TABLE IF EXISTS cuti_kuota;
      DROP TABLE IF EXISTS cuti;
      DROP TABLE IF EXISTS jenis_cuti;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS lembaga;
    `

    const commands = dropTablesSQL.split(";").filter((cmd) => cmd.trim().length > 0)

    for (const command of commands) {
      if (command.trim()) {
        await connection.execute(command)
      }
    }

    console.log("✅ All tables dropped successfully")
    console.log("🎉 Database reset completed!")
    console.log('💡 Run "npm run db:setup" to recreate tables and seed data')
  } catch (error) {
    console.error("❌ Error resetting database:", error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

resetDatabase()
