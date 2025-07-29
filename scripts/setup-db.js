const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
}

async function setupDatabase() {
  let connection

  try {
    console.log("🔄 Connecting to MySQL...")
    connection = await mysql.createConnection(dbConfig)

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || "employee_leave_db"
    console.log(`🔄 Creating database: ${dbName}`)
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    await connection.execute(`USE \`${dbName}\``)

    // Read and execute table creation script
    console.log("🔄 Creating tables...")
    const createTablesSQL = fs.readFileSync(path.join(__dirname, "01-create-tables.sql"), "utf8")
    await connection.execute(createTablesSQL)

    // Read and execute seed data script
    console.log("🔄 Inserting seed data...")
    const seedDataSQL = fs.readFileSync(path.join(__dirname, "02-seed-data.sql"), "utf8")
    await connection.execute(seedDataSQL)

    console.log("✅ Database setup completed successfully!")
    console.log("\n📋 Demo Accounts:")
    console.log("   Superadmin: superadmin@system.com / password")
    console.log("   Admin: admin1@teknologi.com / password")
    console.log("   Employee: john@teknologi.com / password")
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

setupDatabase()
