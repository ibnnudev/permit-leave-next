const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

async function setupDatabase() {
  let connection

  try {
    console.log("🔄 Connecting to MySQL...")

    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    })

    console.log("✅ Connected to MySQL server")

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || "employee_leave_db"
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log(`✅ Database '${dbName}' created or already exists`)

    // Use the database
    await connection.execute(`USE ${dbName}`)

    // Read and execute the create tables script
    console.log("🔄 Creating tables...")
    const createTablesSQL = fs.readFileSync(path.join(__dirname, "01-create-tables.sql"), "utf8")

    // Split SQL commands and execute them one by one
    const commands = createTablesSQL.split(";").filter((cmd) => cmd.trim().length > 0)

    for (const command of commands) {
      if (command.trim()) {
        await connection.execute(command)
      }
    }

    console.log("✅ Tables created successfully")

    // Read and execute the seed data script
    console.log("🔄 Inserting sample data...")
    const seedDataSQL = fs.readFileSync(path.join(__dirname, "02-seed-data.sql"), "utf8")

    // Split SQL commands and execute them one by one
    const seedCommands = seedDataSQL.split(";").filter((cmd) => cmd.trim().length > 0)

    for (const command of seedCommands) {
      if (command.trim()) {
        await connection.execute(command)
      }
    }

    console.log("✅ Sample data inserted successfully")

    console.log("🎉 Database setup completed!")

    // Test the connection
    const [result] = await connection.execute("SELECT COUNT(*) as count FROM users")
    console.log(`📊 Total users in database: ${result[0].count}`)

    console.log("")
    console.log("👤 Demo Accounts:")
    console.log("   Superadmin: superadmin@system.com / admin123")
    console.log("   Admin: admin1@teknologi.com / admin123")
    console.log("   Employee: john@teknologi.com / admin123")
    console.log("")
    console.log("🚀 You can now run: npm run dev")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

setupDatabase()
