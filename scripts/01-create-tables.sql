-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE employee_leave_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE employee_leave_db;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS cuti_approval_log CASCADE;
DROP TABLE IF EXISTS cuti_approval_flow CASCADE;
DROP TABLE IF EXISTS cuti_kuota CASCADE;
DROP TABLE IF EXISTS cuti CASCADE;
DROP TABLE IF EXISTS jenis_cuti CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS lembaga CASCADE;

-- Create LEMBAGA table
CREATE TABLE lembaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT,
    telepon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create USERS table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lembaga_id INT,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin', 'karyawan') NOT NULL DEFAULT 'karyawan',
    jabatan VARCHAR(255),
    tanggal_masuk DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lembaga_id) REFERENCES lembaga(id) ON DELETE SET NULL
);

-- Create JENIS_CUTI table
CREATE TABLE jenis_cuti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_izin VARCHAR(255) NOT NULL,
    maksimal_hari_per_tahun INT NOT NULL DEFAULT 12,
    keterangan TEXT,
    perlu_dokumen BOOLEAN DEFAULT FALSE,
    approval_berjenjang BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create CUTI table
CREATE TABLE cuti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    jenis_cuti_id INT NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    alasan TEXT NOT NULL,
    status ENUM('pending', 'dalam_proses', 'disetujui', 'ditolak') DEFAULT 'pending',
    approval_terakhir_level INT DEFAULT 0,
    catatan_admin TEXT,
    dicatat_oleh INT,
    disetujui_oleh INT,
    dokumen VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jenis_cuti_id) REFERENCES jenis_cuti(id) ON DELETE CASCADE,
    FOREIGN KEY (dicatat_oleh) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (disetujui_oleh) REFERENCES users(id) ON DELETE SET NULL
);

-- Create CUTI_KUOTA table
CREATE TABLE cuti_kuota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    jenis_cuti_id INT NOT NULL,
    tahun YEAR NOT NULL,
    jatah_total INT NOT NULL DEFAULT 12,
    jatah_terpakai INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jenis_cuti_id) REFERENCES jenis_cuti(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_jenis_tahun (user_id, jenis_cuti_id, tahun)
);

-- Create CUTI_APPROVAL_FLOW table
CREATE TABLE cuti_approval_flow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lembaga_id INT NOT NULL,
    jenis_cuti_id INT NOT NULL,
    level INT NOT NULL,
    approver_id INT NOT NULL,
    batas_waktu_approval INT DEFAULT 3,
    dibuat_oleh INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lembaga_id) REFERENCES lembaga(id) ON DELETE CASCADE,
    FOREIGN KEY (jenis_cuti_id) REFERENCES jenis_cuti(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dibuat_oleh) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_flow (lembaga_id, jenis_cuti_id, level)
);

-- Create CUTI_APPROVAL_LOG table
CREATE TABLE cuti_approval_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cuti_id INT NOT NULL,
    approver_id INT NOT NULL,
    level INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'auto_approved') DEFAULT 'pending',
    catatan TEXT,
    tanggal_approval TIMESTAMP NULL,
    batas_waktu_approval TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuti_id) REFERENCES cuti(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create NOTIFIKASI table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pesan TEXT NOT NULL,
    dibaca BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_lembaga ON users(lembaga_id);
CREATE INDEX idx_cuti_user ON cuti(user_id);
CREATE INDEX idx_cuti_status ON cuti(status);
CREATE INDEX idx_cuti_dates ON cuti(tanggal_mulai, tanggal_selesai);
CREATE INDEX idx_approval_log_cuti ON cuti_approval_log(cuti_id);
CREATE INDEX idx_approval_log_approver ON cuti_approval_log(approver_id);
CREATE INDEX idx_approval_log_status ON cuti_approval_log(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(dibaca);
