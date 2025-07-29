-- Insert sample lembaga
INSERT INTO lembaga (nama, alamat, telepon, email) VALUES
('PT Teknologi Maju', 'Jl. Sudirman No. 123, Jakarta', '021-1234567', 'info@teknologi.com'),
('CV Digital Kreatif', 'Jl. Gatot Subroto No. 456, Bandung', '022-7654321', 'contact@digital.com'),
('PT Inovasi Solusi', 'Jl. Diponegoro No. 789, Surabaya', '031-9876543', NULL);

-- Insert sample users with hashed passwords (password: "password")
INSERT INTO users (lembaga_id, nama, email, password, role, jabatan, tanggal_bergabung) VALUES
(NULL, 'Super Administrator', 'superadmin@system.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'System Administrator', '2024-01-01'),
(1, 'Admin Teknologi', 'admin1@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Manager', '2024-01-15'),
(2, 'Admin Digital', 'admin2@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Manager', '2024-01-15'),
(1, 'John Doe', 'john@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Software Developer', '2024-02-01'),
(1, 'Jane Smith', 'jane@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'UI/UX Designer', '2024-02-15'),
(2, 'Bob Wilson', 'bob@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Marketing Specialist', '2024-03-01'),
(1, 'Manager Teknologi', 'manager1@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Project Manager', '2023-01-20'),
(3, 'Admin Inovasi', 'admin3@inovasi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Specialist', '2023-01-05'),
(3, 'Budi Santoso', 'budi@inovasi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Business Analyst', '2023-04-01'),
(3, 'Dewi Lestari', 'dewi@inovasi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Marketing Specialist', '2023-04-15'),
(2, 'Ahmad Rahman', 'ahmad@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Graphic Designer', '2023-03-01'),
(2, 'Siti Nurhaliza', 'siti@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Content Creator', '2023-03-15');

-- Insert jenis cuti
INSERT INTO jenis_cuti (nama, deskripsi, max_hari) VALUES
('Cuti Tahunan', 'Cuti tahunan yang dapat diambil setiap tahun', 12),
('Cuti Sakit', 'Cuti untuk keperluan kesehatan dengan surat dokter', 30),
('Cuti Melahirkan', 'Cuti khusus untuk ibu yang melahirkan', 90),
('Cuti Menikah', 'Cuti khusus untuk pernikahan', 3),
('Cuti Darurat', 'Cuti untuk keperluan mendesak/darurat', 5);

-- Insert sample users (passwords are hashed for 'password')
INSERT INTO users (name, email, password, role, department) VALUES
('Super Admin', 'superadmin@system.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'IT'),
('Admin User', 'admin1@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR'),
('John Doe', 'john@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'Engineering'),
('Jane Smith', 'jane@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'Marketing'),
('Bob Wilson', 'bob@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'Sales');

-- Insert kuota_cuti for current year
INSERT INTO kuota_cuti (user_id, jenis_cuti_id, tahun, kuota_total, kuota_terpakai) VALUES
-- John Doe quotas
(4, 1, 2024, 12, 2),  -- Cuti Tahunan
(4, 2, 2024, 30, 0),  -- Cuti Sakit
(4, 4, 2024, 3, 0),   -- Cuti Menikah
(4, 5, 2024, 7, 1),   -- Cuti Khusus

-- Jane Smith quotas
(5, 1, 2024, 12, 1),  -- Cuti Tahunan
(5, 2, 2024, 30, 3),  -- Cuti Sakit
(5, 3, 2024, 90, 0),  -- Cuti Melahirkan
(5, 4, 2024, 3, 0),   -- Cuti Menikah
(5, 5, 2024, 7, 0),   -- Cuti Khusus

-- Bob Wilson quotas
(6, 1, 2024, 12, 0),  -- Cuti Tahunan
(6, 2, 2024, 30, 1),  -- Cuti Sakit
(6, 4, 2024, 3, 0),   -- Cuti Menikah
(6, 5, 2024, 7, 0);   -- Cuti Khusus

-- Insert sample cuti applications
INSERT INTO cuti (user_id, jenis_cuti_id, tanggal_mulai, tanggal_selesai, alasan, status) VALUES
-- John Doe applications
(4, 1, '2024-03-15', '2024-03-17', 'Liburan keluarga ke Bali', 'disetujui'),
(4, 2, '2024-02-20', '2024-02-21', 'Demam dan flu', 'disetujui'),
(4, 1, '2024-12-24', '2024-12-26', 'Liburan Natal bersama keluarga', 'pending'),

-- Jane Smith applications
(5, 1, '2024-01-10', '2024-01-12', 'Acara keluarga', 'disetujui'),
(5, 2, '2024-11-15', '2024-11-16', 'Kontrol kesehatan rutin', 'pending'),

-- Ahmad Rahman applications
(7, 2, '2024-01-25', '2024-01-27', 'Sakit perut dan demam', 'disetujui'),
(7, 1, '2024-06-10', '2024-06-14', 'Liburan keluarga', 'dalam_proses'),

-- Siti Nurhaliza applications
(8, 1, '2024-08-01', '2024-08-03', 'Acara pernikahan saudara', 'pending'),

-- Budi Santoso applications
(10, 1, '2024-05-20', '2024-05-22', 'Liburan singkat', 'ditolak'),

-- Dewi Lestari applications
(11, 2, '2024-09-10', '2024-09-11', 'Sakit kepala migrain', 'pending');

-- Insert sample approval logs for processed applications
INSERT INTO cuti_approval_log (cuti_id, approver_id, level, status, catatan, tanggal_approval, batas_waktu_approval) VALUES
-- John's first application (approved)
(1, 5, 1, 'approved', 'Disetujui untuk liburan keluarga', '2024-03-10 10:00:00', '2024-03-13 23:59:59'),
(1, 2, 2, 'approved', 'Final approval dari HR', '2024-03-11 14:30:00', '2024-03-13 23:59:59'),

-- John's second application (approved)
(2, 5, 1, 'approved', 'Disetujui untuk cuti sakit', '2024-02-19 09:15:00', '2024-02-21 23:59:59'),
(2, 2, 2, 'approved', 'Approved by HR', '2024-02-19 15:45:00', '2024-02-20 23:59:59'),

-- Jane's first application (approved)
(4, 5, 1, 'approved', 'Disetujui untuk acara keluarga', '2024-01-08 11:20:00', '2024-01-11 23:59:59'),
(4, 2, 2, 'approved', 'HR approval', '2024-01-08 16:10:00', '2024-01-09 23:59:59'),

-- Ahmad's first application (approved)
(6, 6, 1, 'approved', 'Disetujui untuk cuti sakit', '2024-01-24 08:30:00', '2024-01-26 23:59:59'),

-- Budi's application (rejected)
(9, 9, 1, 'rejected', 'Periode terlalu sibuk, mohon reschedule', '2024-05-18 13:45:00', '2024-05-21 23:59:59');

-- Insert sample notifications
INSERT INTO notifications (user_id, pesan, dibaca) VALUES
(4, 'Pengajuan cuti tahunan Anda telah disetujui', TRUE),
(4, 'Pengajuan cuti sakit Anda telah disetujui', TRUE),
(4, 'Pengajuan cuti tahunan baru menunggu persetujuan', FALSE),
(5, 'Pengajuan cuti tahunan Anda telah disetujui', TRUE),
(5, 'Pengajuan cuti sakit menunggu persetujuan', FALSE),
(6, 'Pengajuan cuti sakit Anda telah disetujui', TRUE),
(6, 'Pengajuan cuti tahunan sedang dalam proses', FALSE),
(7, 'Pengajuan cuti tahunan menunggu persetujuan', FALSE),
(10, 'Pengajuan cuti tahunan Anda ditolak', FALSE),
(11, 'Pengajuan cuti sakit menunggu persetujuan', FALSE),
-- Notifications for approvers
(2, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE),
(5, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE),
(6, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE),
(9, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE);

-- Insert approval flow for setiap lembaga and jenis cuti yang memerlukan approval berjenjang
-- PT Teknologi Maju (lembaga_id: 1)
INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh) VALUES
-- Cuti Tahunan: Level 1 (Manager) -> Level 2 (HR)
(1, 1, 1, 5, 3, 1), -- Manager Teknologi
(1, 1, 2, 2, 2, 1), -- Admin Teknologi (HR)

-- Cuti Sakit: Level 1 (Manager) -> Level 2 (HR)
(1, 2, 1, 5, 2, 1), -- Manager Teknologi
(1, 2, 2, 2, 1, 1), -- Admin Teknologi (HR)

-- Cuti Haji/Umroh: Level 1 (Manager) -> Level 2 (HR)
(1, 7, 1, 5, 5, 1), -- Manager Teknologi
(1, 7, 2, 2, 3, 1), -- Admin Teknologi (HR)

-- Cuti Besar: Level 1 (Manager) -> Level 2 (HR)
(1, 8, 1, 5, 3, 1), -- Manager Teknologi
(1, 8, 2, 2, 2, 1); -- Admin Teknologi (HR)

-- CV Digital Kreatif (lembaga_id: 2)
INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh) VALUES
-- Cuti Tahunan: Level 1 (HR)
(2, 1, 1, 6, 3, 1), -- Admin Digital

-- Cuti Sakit: Level 1 (HR)
(2, 2, 1, 6, 2, 1), -- Admin Digital

-- Cuti Haji/Umroh: Level 1 (HR)
(2, 7, 1, 6, 5, 1), -- Admin Digital

-- Cuti Besar: Level 1 (HR)
(2, 8, 1, 6, 3, 1); -- Admin Digital

-- PT Inovasi Solusi (lembaga_id: 3)
INSERT INTO cuti_approval_flow (lembaga_id, jenis_cuti_id, level, approver_id, batas_waktu_approval, dibuat_oleh) VALUES
-- Cuti Tahunan: Level 1 (HR)
(3, 1, 1, 9, 3, 1), -- Admin Inovasi

-- Cuti Sakit: Level 1 (HR)
(3, 2, 1, 9, 2, 1), -- Admin Inovasi

-- Cuti Haji/Umroh: Level 1 (HR)
(3, 7, 1, 9, 5, 1), -- Admin Inovasi

-- Cuti Besar: Level 1 (HR)
(3, 8, 1, 9, 3, 1); -- Admin Inovasi

-- Insert sample cuti_requests
INSERT INTO cuti_requests (user_id, jenis_cuti_id, tanggal_mulai, tanggal_selesai, jumlah_hari, keterangan, status, approved_by, approved_at) VALUES
(4, 1, '2024-03-15', '2024-03-16', 2, 'Liburan keluarga', 'approved', 2, '2024-03-10 10:00:00'),
(4, 5, '2024-04-20', '2024-04-20', 1, 'Keperluan pribadi', 'pending', NULL, NULL),
(5, 1, '2024-03-01', '2024-03-01', 1, 'Acara keluarga', 'approved', 2, '2024-02-28 14:30:00'),
(5, 2, '2024-03-25', '2024-03-27', 3, 'Sakit demam', 'approved', 2, '2024-03-25 09:15:00'),
(6, 2, '2024-04-01', '2024-04-01', 1, 'Kontrol kesehatan', 'rejected', 3, '2024-03-30 16:45:00');

-- Insert sample leave requests
INSERT INTO leave_requests (user_id, jenis_cuti_id, start_date, end_date, total_days, reason, status) VALUES
(3, 1, '2024-01-15', '2024-01-16', 2, 'Keperluan keluarga', 'approved'),
(4, 1, '2024-02-10', '2024-02-14', 5, 'Liburan keluarga', 'approved'),
(5, 1, '2024-03-01', '2024-03-03', 3, 'Acara keluarga', 'pending');
