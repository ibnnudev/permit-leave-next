const { Pool } = require("pg")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

async function resetDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log("🔄 Resetting database...")

    // Drop all tables in correct order (reverse of creation)
    const dropTablesSQL = `
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS cuti_approval_log CASCADE;
      DROP TABLE IF EXISTS cuti_approval_flow CASCADE;
      DROP TABLE IF EXISTS cuti_kuota CASCADE;
      DROP TABLE IF EXISTS cuti CASCADE;
      DROP TABLE IF EXISTS jenis_cuti CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS lembaga CASCADE;
    `

    await pool.query(dropTablesSQL)
    console.log("✅ All tables dropped successfully")

    console.log("🎉 Database reset completed!")
    console.log('💡 Run "npm run db:setup" to recreate tables and seed data')
  } catch (error) {
    console.error("❌ Error resetting database:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

resetDatabase()
