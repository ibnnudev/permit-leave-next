const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log("🔄 Setting up database...")

    // Read and execute the create tables script
    const createTablesSQL = fs.readFileSync(path.join(__dirname, "01-create-tables.sql"), "utf8")

    await pool.query(createTablesSQL)
    console.log("✅ Tables created successfully")

    // Read and execute the seed data script
    const seedDataSQL = fs.readFileSync(path.join(__dirname, "02-seed-data.sql"), "utf8")

    await pool.query(seedDataSQL)
    console.log("✅ Sample data inserted successfully")

    console.log("🎉 Database setup completed!")

    // Test the connection
    const result = await pool.query("SELECT COUNT(*) as count FROM users")
    console.log(`📊 Total users in database: ${result.rows[0].count}`)
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setupDatabase()
