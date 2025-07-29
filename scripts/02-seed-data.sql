-- Insert sample lembaga
INSERT INTO lembaga (nama, alamat, telepon) VALUES
('PT. Teknologi Maju', 'Jl. Sudirman No. 123, Jakarta', '021-1234567'),
('CV. Inovasi Digital', 'Jl. Gatot Subroto No. 456, Bandung', '022-7654321'),
('Koperasi Sejahtera', 'Jl. Ahmad Yani No. 789, Surabaya', '031-9876543');

-- Insert superadmin user
INSERT INTO users (lembaga_id, nama, email, password, role, jabatan, tanggal_masuk) VALUES
(NULL, 'Super Administrator', 'superadmin@system.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'System Administrator', '2024-01-01');

-- Insert admin users for each lembaga
INSERT INTO users (lembaga_id, nama, email, password, role, jabatan, tanggal_masuk) VALUES
(1, 'Admin PT Teknologi', 'admin1@teknologi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Manager', '2024-01-15'),
(1, 'Manager PT Teknologi', 'manager1@teknologi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'General Manager', '2024-01-10'),
(2, 'Admin CV Inovasi', 'admin2@inovasi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Coordinator', '2024-01-20'),
(3, 'Admin Koperasi', 'admin3@koperasi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Kepala Bagian', '2024-01-25');

-- Insert employee users
INSERT INTO users (lembaga_id, nama, email, password, role, jabatan, tanggal_masuk) VALUES
(1, 'John Doe', 'john@teknologi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Software Developer', '2024-02-01'),
(1, 'Jane Smith', 'jane@teknologi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'UI/UX Designer', '2024-02-15'),
(2, 'Ahmad Rahman', 'ahmad@inovasi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Marketing Specialist', '2024-03-01'),
(3, 'Siti Nurhaliza', 'siti@koperasi.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Accounting Staff', '2024-03-15');

-- Insert jenis cuti
INSERT INTO jenis_cuti (nama_izin, maksimal_hari_per_tahun, keterangan, perlu_dokumen, approval_berjenjang) VALUES
('Cuti Tahunan', 12, 'Cuti tahunan untuk karyawan tetap', FALSE, FALSE),
('Cuti Sakit', 30, 'Cuti untuk keperluan kesehatan', TRUE, TRUE),
('Cuti Melahirkan', 90, 'Cuti melahirkan untuk karyawan wanita', TRUE, TRUE),
('Cuti Menikah', 3, 'Cuti untuk keperluan pernikahan', TRUE, FALSE),
('Cuti Khitan/Baptis Anak', 2, 'Cuti untuk acara khitan atau baptis anak', FALSE, FALSE),
('Cuti Kematian Keluarga', 3, 'Cuti untuk keperluan kematian keluarga dekat', TRUE, FALSE);

-- Insert approval flow untuk PT Teknologi Maju (2 level approval untuk cuti berjenjang)
INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh) VALUES
-- Cuti Sakit (2 level)
(1, 2, 1, 2, 2, 1), -- Level 1: HR Manager
(1, 2, 2, 3, 3, 1), -- Level 2: General Manager
-- Cuti Melahirkan (2 level)
(1, 3, 1, 2, 2, 1), -- Level 1: HR Manager
(1, 3, 2, 3, 3, 1), -- Level 2: General Manager
-- Cuti Tahunan (1 level)
(1, 1, 1, 2, 2, 1), -- Level 1: HR Manager
-- Cuti Menikah (1 level)
(1, 4, 1, 2, 2, 1), -- Level 1: HR Manager
-- Cuti Khitan/Baptis (1 level)
(1, 5, 1, 2, 2, 1), -- Level 1: HR Manager
-- Cuti Kematian (1 level)
(1, 6, 1, 2, 2, 1); -- Level 1: HR Manager

-- Insert approval flow untuk CV Inovasi Digital (1 level approval)
INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh) VALUES
(2, 1, 1, 5, 2, 1), -- Cuti Tahunan
(2, 2, 1, 5, 2, 1), -- Cuti Sakit
(2, 3, 1, 5, 2, 1), -- Cuti Melahirkan
(2, 4, 1, 5, 2, 1), -- Cuti Menikah
(2, 5, 1, 5, 2, 1), -- Cuti Khitan/Baptis
(2, 6, 1, 5, 2, 1); -- Cuti Kematian

-- Insert approval flow untuk Koperasi Sejahtera (1 level approval)
INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh) VALUES
(3, 1, 1, 6, 2, 1), -- Cuti Tahunan
(3, 2, 1, 6, 2, 1), -- Cuti Sakit
(3, 3, 1, 6, 2, 1), -- Cuti Melahirkan
(3, 4, 1, 6, 2, 1), -- Cuti Menikah
(3, 5, 1, 6, 2, 1), -- Cuti Khitan/Baptis
(3, 6, 1, 6, 2, 1); -- Cuti Kematian

-- Insert kuota cuti untuk karyawan tahun 2024
INSERT INTO cuti_kuota (user_id, jenis_cuti_id, tahun, jatah_total, jatah_terpakai) VALUES
-- John Doe (user_id: 7)
(7, 1, 2024, 12, 2), -- Cuti Tahunan
(7, 2, 2024, 30, 0), -- Cuti Sakit
(7, 4, 2024, 3, 0),  -- Cuti Menikah
(7, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis
(7, 6, 2024, 3, 0),  -- Cuti Kematian
-- Jane Smith (user_id: 8)
(8, 1, 2024, 12, 0), -- Cuti Tahunan
(8, 2, 2024, 30, 0), -- Cuti Sakit
(8, 3, 2024, 90, 0), -- Cuti Melahirkan
(8, 4, 2024, 3, 0),  -- Cuti Menikah
(8, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis
(8, 6, 2024, 3, 0),  -- Cuti Kematian
-- Ahmad Rahman (user_id: 9)
(9, 1, 2024, 12, 1), -- Cuti Tahunan
(9, 2, 2024, 30, 0), -- Cuti Sakit
(9, 4, 2024, 3, 0),  -- Cuti Menikah
(9, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis
(9, 6, 2024, 3, 0),  -- Cuti Kematian
-- Siti Nurhaliza (user_id: 10)
(10, 1, 2024, 12, 0), -- Cuti Tahunan
(10, 2, 2024, 30, 0), -- Cuti Sakit
(10, 3, 2024, 90, 0), -- Cuti Melahirkan
(10, 4, 2024, 3, 0),  -- Cuti Menikah
(10, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis
(10, 6, 2024, 3, 0);  -- Cuti Kematian

-- Insert sample cuti applications
INSERT INTO cuti (user_id, jenis_cuti_id, tanggal_mulai, tanggal_selesai, alasan, status) VALUES
(7, 1, '2024-03-01', '2024-03-02', 'Liburan keluarga', 'disetujui'),
(8, 2, '2024-03-15', '2024-03-17', 'Demam dan flu', 'dalam_proses'),
(9, 1, '2024-04-01', '2024-04-01', 'Keperluan pribadi', 'pending');

-- Insert sample notifications
INSERT INTO notifications (user_id, pesan, dibaca) VALUES
(7, 'Pengajuan cuti tahunan Anda telah disetujui', FALSE),
(8, 'Pengajuan cuti sakit Anda sedang dalam proses review', FALSE),
(2, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE),
(3, 'Ada pengajuan cuti yang menunggu persetujuan level 2', FALSE);
