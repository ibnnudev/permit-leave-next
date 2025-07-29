-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS cuti_approval_log CASCADE;
DROP TABLE IF EXISTS cuti_approval_flow CASCADE;
DROP TABLE IF EXISTS cuti_kuota CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS cuti CASCADE;
DROP TABLE IF EXISTS jenis_cuti CASCADE;
DROP TABLE IF EXISTS leave_types CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS lembaga CASCADE;

-- Create LEMBAGA table
CREATE TABLE lembaga (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT,
    telepon VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create USERS table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    lembaga_id INTEGER REFERENCES lembaga(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('superadmin', 'admin', 'karyawan')) NOT NULL,
    jabatan VARCHAR(255),
    tanggal_masuk DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create JENIS_CUTI table
CREATE TABLE jenis_cuti (
    id SERIAL PRIMARY KEY,
    nama_izin VARCHAR(255) NOT NULL,
    maksimal_hari_per_tahun INTEGER DEFAULT 0,
    keterangan TEXT,
    perlu_dokumen BOOLEAN DEFAULT FALSE,
    approval_berjenjang BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create CUTI table
CREATE TABLE cuti (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    jenis_cuti_id INTEGER REFERENCES jenis_cuti(id) ON DELETE CASCADE,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    alasan TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'dalam_proses', 'disetujui', 'ditolak')) DEFAULT 'pending',
    approval_terakhir_level INTEGER DEFAULT 0,
    catatan_admin TEXT,
    dicatat_oleh INTEGER REFERENCES users(id),
    disetujui_oleh INTEGER REFERENCES users(id),
    dokumen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create CUTI_KUOTA table
CREATE TABLE cuti_kuota (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    jenis_cuti_id INTEGER REFERENCES jenis_cuti(id) ON DELETE CASCADE,
    tahun INTEGER NOT NULL,
    jatah_total INTEGER DEFAULT 0,
    jatah_terpakai INTEGER DEFAULT 0,
    UNIQUE(user_id, jenis_cuti_id, tahun)
);

-- Create CUTI_APPROVAL_FLOW table
CREATE TABLE cuti_approval_flow (
    id SERIAL PRIMARY KEY,
    lembaga_id INTEGER REFERENCES lembaga(id) ON DELETE CASCADE,
    jenis_cuti_id INTEGER REFERENCES jenis_cuti(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    approver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    batas_waktu_approval INTEGER DEFAULT 2, -- dalam hari
    dibuat_oleh INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lembaga_id, jenis_cuti_id, level)
);

-- Create CUTI_APPROVAL_LOG table
CREATE TABLE cuti_approval_log (
    id SERIAL PRIMARY KEY,
    cuti_id INTEGER REFERENCES cuti(id) ON DELETE CASCADE,
    approver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'auto_approved')) DEFAULT 'pending',
    catatan TEXT,
    tanggal_approval TIMESTAMP,
    batas_waktu_approval TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create NOTIFICATIONS table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pesan TEXT NOT NULL,
    dibaca BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_lembaga ON users(lembaga_id);
CREATE INDEX idx_cuti_user ON cuti(user_id);
CREATE INDEX idx_cuti_status ON cuti(status);
CREATE INDEX idx_approval_log_cuti ON cuti_approval_log(cuti_id);
CREATE INDEX idx_approval_log_status ON cuti_approval_log(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, dibaca);
