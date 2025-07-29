-- Create lembaga table
CREATE TABLE IF NOT EXISTS lembaga (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  alamat TEXT,
  telepon VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lembaga_id INT,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin', 'karyawan') NOT NULL DEFAULT 'karyawan',
  jabatan VARCHAR(255),
  tanggal_bergabung DATE,
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lembaga_id) REFERENCES lembaga(id) ON DELETE SET NULL
);

-- Create jenis_cuti table
CREATE TABLE IF NOT EXISTS jenis_cuti (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  max_hari INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create kuota_cuti table
CREATE TABLE IF NOT EXISTS kuota_cuti (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  jenis_cuti_id INT NOT NULL,
  tahun YEAR NOT NULL,
  kuota_total INT DEFAULT 0,
  kuota_terpakai INT DEFAULT 0,
  kuota_sisa INT GENERATED ALWAYS AS (kuota_total - kuota_terpakai) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (jenis_cuti_id) REFERENCES jenis_cuti(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_jenis_tahun (user_id, jenis_cuti_id, tahun)
);

-- Create cuti_requests table
CREATE TABLE IF NOT EXISTS cuti_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  jenis_cuti_id INT NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  jumlah_hari INT NOT NULL,
  keterangan TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  keterangan_admin TEXT,
  approved_by INT,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (jenis_cuti_id) REFERENCES jenis_cuti(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_lembaga ON users(lembaga_id);
CREATE INDEX idx_cuti_requests_user ON cuti_requests(user_id);
CREATE INDEX idx_cuti_requests_status ON cuti_requests(status);
CREATE INDEX idx_cuti_requests_dates ON cuti_requests(tanggal_mulai, tanggal_selesai);
CREATE INDEX idx_kuota_cuti_user_tahun ON kuota_cuti(user_id, tahun);
