-- Insert sample lembaga
INSERT INTO lembaga (nama, alamat, telepon) VALUES
('PT Teknologi Maju', 'Jl. Sudirman No. 123, Jakarta', '021-1234567'),
('CV Digital Kreatif', 'Jl. Gatot Subroto No. 456, Bandung', '022-7654321'),
('Koperasi Sejahtera', 'Jl. Ahmad Yani No. 789, Surabaya', '031-9876543');

-- Insert sample users with hashed passwords (password: admin123)
INSERT INTO users (lembaga_id, nama, email, password, role, jabatan, tanggal_masuk) VALUES
(NULL, 'Super Administrator', 'superadmin@system.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'System Administrator', '2024-01-01'),
(1, 'Admin Teknologi', 'admin1@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Manager', '2024-01-15'),
(2, 'Admin Digital', 'admin2@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Supervisor', '2024-01-20'),
(1, 'John Doe', 'john@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Software Developer', '2024-02-01'),
(1, 'Jane Smith', 'jane@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'UI/UX Designer', '2024-02-15'),
(2, 'Bob Wilson', 'bob@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Marketing Specialist', '2024-03-01'),
(3, 'Admin Koperasi', 'admin3@koperasi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'General Manager', '2024-01-10');

-- Insert jenis cuti
INSERT INTO jenis_cuti (nama_izin, maksimal_hari_per_tahun, keterangan, perlu_dokumen, approval_berjenjang) VALUES
('Cuti Tahunan', 12, 'Cuti tahunan untuk karyawan tetap', FALSE, FALSE),
('Cuti Sakit', 30, 'Cuti untuk keperluan kesehatan', TRUE, TRUE),
('Cuti Melahirkan', 90, 'Cuti melahirkan untuk karyawan wanita', TRUE, TRUE),
('Cuti Menikah', 3, 'Cuti untuk keperluan pernikahan', TRUE, FALSE),
('Cuti Duka', 2, 'Cuti untuk keperluan duka keluarga', TRUE, FALSE),
('Izin Pribadi', 6, 'Izin untuk keperluan pribadi mendesak', FALSE, FALSE);

-- Insert cuti kuota untuk tahun 2024
INSERT INTO cuti_kuota (user_id, jenis_cuti_id, tahun, jatah_total, jatah_terpakai) VALUES
-- John Doe (user_id: 4)
(4, 1, 2024, 12, 2), -- Cuti Tahunan
(4, 2, 2024, 30, 0), -- Cuti Sakit
(4, 4, 2024, 3, 0),  -- Cuti Menikah
(4, 5, 2024, 2, 0),  -- Cuti Duka
(4, 6, 2024, 6, 1),  -- Izin Pribadi

-- Jane Smith (user_id: 5)
(5, 1, 2024, 12, 1), -- Cuti Tahunan
(5, 2, 2024, 30, 0), -- Cuti Sakit
(5, 3, 2024, 90, 0), -- Cuti Melahirkan
(5, 4, 2024, 3, 0),  -- Cuti Menikah
(5, 5, 2024, 2, 0),  -- Cuti Duka
(5, 6, 2024, 6, 0),  -- Izin Pribadi

-- Bob Wilson (user_id: 6)
(6, 1, 2024, 12, 0), -- Cuti Tahunan
(6, 2, 2024, 30, 0), -- Cuti Sakit
(6, 4, 2024, 3, 0),  -- Cuti Menikah
(6, 5, 2024, 2, 0),  -- Cuti Duka
(6, 6, 2024, 6, 0);  -- Izin Pribadi

-- Insert approval flow untuk PT Teknologi Maju (lembaga_id: 1)
INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh) VALUES
-- Cuti Tahunan (non-berjenjang, hanya 1 level)
(1, 1, 1, 2, 2, 1), -- Level 1: Admin Teknologi

-- Cuti Sakit (berjenjang, 2 level)
(1, 2, 1, 2, 2, 1), -- Level 1: Admin Teknologi
(1, 2, 2, 1, 3, 1), -- Level 2: Super Admin (sebagai direktur)

-- Cuti Melahirkan (berjenjang, 2 level)
(1, 3, 1, 2, 3, 1), -- Level 1: Admin Teknologi
(1, 3, 2, 1, 5, 1), -- Level 2: Super Admin

-- Cuti Menikah (non-berjenjang)
(1, 4, 1, 2, 2, 1), -- Level 1: Admin Teknologi

-- Cuti Duka (non-berjenjang)
(1, 5, 1, 2, 1, 1), -- Level 1: Admin Teknologi

-- Izin Pribadi (non-berjenjang)
(1, 6, 1, 2, 1, 1); -- Level 1: Admin Teknologi

-- Insert approval flow untuk CV Digital Kreatif (lembaga_id: 2)
INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh) VALUES
-- Cuti Tahunan
(2, 1, 1, 3, 2, 1), -- Level 1: Admin Digital

-- Cuti Sakit (berjenjang)
(2, 2, 1, 3, 2, 1), -- Level 1: Admin Digital
(2, 2, 2, 1, 3, 1), -- Level 2: Super Admin

-- Cuti Melahirkan (berjenjang)
(2, 3, 1, 3, 3, 1), -- Level 1: Admin Digital
(2, 3, 2, 1, 5, 1), -- Level 2: Super Admin

-- Cuti Menikah
(2, 4, 1, 3, 2, 1), -- Level 1: Admin Digital

-- Cuti Duka
(2, 5, 1, 3, 1, 1), -- Level 1: Admin Digital

-- Izin Pribadi
(2, 6, 1, 3, 1, 1); -- Level 1: Admin Digital

-- Insert sample cuti applications
INSERT INTO cuti (user_id, jenis_cuti_id, tanggal_mulai, tanggal_selesai, alasan, status, approval_terakhir_level) VALUES
(4, 1, '2024-03-15', '2024-03-17', 'Liburan keluarga', 'disetujui', 1),
(4, 6, '2024-02-20', '2024-02-20', 'Keperluan pribadi mendesak', 'disetujui', 1),
(5, 1, '2024-04-01', '2024-04-03', 'Refreshing dan istirahat', 'dalam_proses', 0),
(6, 1, '2024-04-10', '2024-04-12', 'Mudik lebaran', 'pending', 0);

-- Insert sample approval logs
INSERT INTO cuti_approval_log (cuti_id, approver_id, level, status, catatan, tanggal_approval, batas_waktu_approval) VALUES
(1, 2, 1, 'approved', 'Disetujui untuk liburan keluarga', '2024-03-10 10:30:00', '2024-03-12 23:59:59'),
(2, 2, 1, 'approved', 'Disetujui untuk keperluan mendesak', '2024-02-19 14:15:00', '2024-02-21 23:59:59'),
(3, 2, 1, 'pending', NULL, NULL, '2024-04-03 23:59:59');

-- Insert sample notifications
INSERT INTO notifikasi (user_id, pesan, dibaca) VALUES
(4, 'Pengajuan cuti tahunan Anda telah disetujui', TRUE),
(4, 'Pengajuan izin pribadi Anda telah disetujui', TRUE),
(5, 'Pengajuan cuti tahunan Anda sedang dalam proses review', FALSE),
(2, 'Ada pengajuan cuti baru yang perlu Anda review dari Jane Smith', FALSE),
(6, 'Selamat datang di sistem manajemen cuti karyawan', FALSE);

-- Update jatah terpakai berdasarkan cuti yang disetujui
UPDATE cuti_kuota SET jatah_terpakai = 3 WHERE user_id = 4 AND jenis_cuti_id = 1; -- John: 3 hari cuti tahunan
UPDATE cuti_kuota SET jatah_terpakai = 1 WHERE user_id = 4 AND jenis_cuti_id = 6; -- John: 1 hari izin pribadi
