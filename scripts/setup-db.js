const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")
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
        await connection.query(`USE \`${dbName}\``)

        // Create tables
        console.log("🔄 Creating tables...")

        // Users table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('superadmin', 'admin', 'employee') DEFAULT 'employee',
        department VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

        // Jenis cuti table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS jenis_cuti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        max_days INT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

        // Leave requests table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        jenis_cuti_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_days INT NOT NULL,
        reason TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        reviewed_by INT NULL,
        review_notes TEXT NULL,
        reviewed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (jenis_cuti_id) REFERENCES jenis_cuti(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `)

        // Kuota cuti table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS kuota_cuti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        year INT NOT NULL,
        total_quota INT NOT NULL DEFAULT 12,
        used_quota INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_year (user_id, year)
      )
    `)

        console.log("✅ Tables created successfully")

        // Insert sample data
        console.log("🔄 Inserting sample data...")

        // Hash passwords
        const hashedPassword = await bcrypt.hash("password", 10)

        // Insert users
        await connection.execute(
            `
      INSERT IGNORE INTO users (name, email, password, role, department) VALUES
      ('Super Admin', 'superadmin@system.com', ?, 'superadmin', 'IT'),
      ('Admin User', 'admin1@teknologi.com', ?, 'admin', 'HR'),
      ('John Doe', 'john@teknologi.com', ?, 'employee', 'Engineering'),
      ('Jane Smith', 'jane@teknologi.com', ?, 'employee', 'Marketing'),
      ('Bob Wilson', 'bob@teknologi.com', ?, 'employee', 'Sales')
    `,
            [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword],
        )

        // Insert jenis cuti
        await connection.execute(`
      INSERT IGNORE INTO jenis_cuti (id, nama, max_days, description) VALUES
      (1, 'Cuti Tahunan', 12, 'Cuti tahunan yang dapat diambil setiap tahun'),
      (2, 'Cuti Sakit', 30, 'Cuti untuk keperluan kesehatan dengan surat dokter'),
      (3, 'Cuti Melahirkan', 90, 'Cuti khusus untuk ibu yang melahirkan'),
      (4, 'Cuti Menikah', 3, 'Cuti khusus untuk pernikahan'),
      (5, 'Cuti Darurat', 5, 'Cuti untuk keperluan mendesak/darurat')
    `)

        // Insert kuota cuti for current year
        const currentYear = new Date().getFullYear()
        await connection.execute(
            `
      INSERT IGNORE INTO kuota_cuti (user_id, year, total_quota, used_quota) VALUES
      (3, ?, 12, 2),
      (4, ?, 12, 5),
      (5, ?, 12, 0)
    `,
            [currentYear, currentYear, currentYear],
        )

        // Insert sample leave requests
        await connection.execute(`
      INSERT IGNORE INTO leave_requests (user_id, jenis_cuti_id, start_date, end_date, total_days, reason, status) VALUES
      (3, 1, '2024-01-15', '2024-01-16', 2, 'Keperluan keluarga', 'approved'),
      (4, 1, '2024-02-10', '2024-02-14', 5, 'Liburan keluarga', 'approved'),
      (5, 1, '2024-03-01', '2024-03-03', 3, 'Acara keluarga', 'pending')
    `)

        console.log("✅ Sample data inserted successfully")
        console.log("🎉 Database setup completed!")
        console.log("\n📋 Demo Accounts:")
        console.log("   Superadmin: superadmin@system.com / password")
        console.log("   Admin: admin1@teknologi.com / password")
        console.log("   Employee: john@teknologi.com / password")
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
