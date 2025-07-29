-- Insert sample lembaga
INSERT INTO lembaga (nama, alamat, telepon) VALUES
('PT Teknologi Maju', 'Jl. Sudirman No. 123, Jakarta', '021-1234567'),
('CV Digital Kreatif', 'Jl. Gatot Subroto No. 456, Bandung', '022-7654321'),
('PT Inovasi Solusi', 'Jl. Diponegoro No. 789, Surabaya', '031-9876543');

-- Insert sample users (password: admin123 - hashed with bcrypt)
INSERT INTO users (lembaga_id, nama, email, password, role, jabatan, tanggal_masuk) VALUES
-- Superadmin
(NULL, 'Super Admin', 'superadmin@system.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'System Administrator', '2023-01-01'),

-- PT Teknologi Maju
(1, 'Admin Teknologi', 'admin1@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Manager', '2023-01-15'),
(1, 'John Doe', 'john@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Software Developer', '2023-02-01'),
(1, 'Jane Smith', 'jane@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'UI/UX Designer', '2023-02-15'),
(1, 'Manager Teknologi', 'manager1@teknologi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Project Manager', '2023-01-20'),

-- CV Digital Kreatif
(2, 'Admin Digital', 'admin2@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Coordinator', '2023-01-10'),
(2, 'Ahmad Rahman', 'ahmad@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Graphic Designer', '2023-03-01'),
(2, 'Siti Nurhaliza', 'siti@digital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Content Creator', '2023-03-15'),

-- PT Inovasi Solusi
(3, 'Admin Inovasi', 'admin3@inovasi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'HR Specialist', '2023-01-05'),
(3, 'Budi Santoso', 'budi@inovasi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Business Analyst', '2023-04-01'),
(3, 'Dewi Lestari', 'dewi@inovasi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', 'Marketing Specialist', '2023-04-15');

-- Insert jenis cuti
INSERT INTO jenis_cuti (nama_izin, maksimal_hari_per_tahun, keterangan, perlu_dokumen, approval_berjenjang) VALUES
('Cuti Tahunan', 12, 'Cuti tahunan untuk karyawan tetap', FALSE, TRUE),
('Cuti Sakit', 30, 'Cuti untuk keperluan kesehatan', TRUE, TRUE),
('Cuti Melahirkan', 90, 'Cuti melahirkan untuk karyawan wanita', TRUE, FALSE),
('Cuti Menikah', 3, 'Cuti untuk keperluan pernikahan', TRUE, FALSE),
('Cuti Khitan/Baptis Anak', 2, 'Cuti untuk acara khitan atau baptis anak', TRUE, FALSE),
('Cuti Kematian Keluarga', 3, 'Cuti untuk keperluan kematian keluarga dekat', TRUE, FALSE),
('Cuti Haji/Umroh', 25, 'Cuti untuk menunaikan ibadah haji atau umroh', TRUE, TRUE),
('Cuti Besar', 30, 'Cuti besar setelah bekerja 6 tahun berturut-turut', FALSE, TRUE);

-- Insert cuti kuota untuk semua karyawan (tahun 2024)
INSERT INTO cuti_kuota (user_id, jenis_cuti_id, tahun, jatah_total, jatah_terpakai) VALUES
-- John Doe (user_id: 3)
(3, 1, 2024, 12, 2), -- Cuti Tahunan
(3, 2, 2024, 30, 0), -- Cuti Sakit
(3, 4, 2024, 3, 0),  -- Cuti Menikah
(3, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis Anak
(3, 6, 2024, 3, 0),  -- Cuti Kematian Keluarga
(3, 7, 2024, 25, 0), -- Cuti Haji/Umroh
(3, 8, 2024, 30, 0), -- Cuti Besar

-- Jane Smith (user_id: 4)
(4, 1, 2024, 12, 1), -- Cuti Tahunan
(4, 2, 2024, 30, 0), -- Cuti Sakit
(4, 3, 2024, 90, 0), -- Cuti Melahirkan
(4, 4, 2024, 3, 0),  -- Cuti Menikah
(4, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis Anak
(4, 6, 2024, 3, 0),  -- Cuti Kematian Keluarga
(4, 7, 2024, 25, 0), -- Cuti Haji/Umroh
(4, 8, 2024, 30, 0), -- Cuti Besar

-- Ahmad Rahman (user_id: 7)
(7, 1, 2024, 12, 0), -- Cuti Tahunan
(7, 2, 2024, 30, 3), -- Cuti Sakit
(7, 4, 2024, 3, 0),  -- Cuti Menikah
(7, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis Anak
(7, 6, 2024, 3, 0),  -- Cuti Kematian Keluarga
(7, 7, 2024, 25, 0), -- Cuti Haji/Umroh
(7, 8, 2024, 30, 0), -- Cuti Besar

-- Siti Nurhaliza (user_id: 8)
(8, 1, 2024, 12, 0), -- Cuti Tahunan
(8, 2, 2024, 30, 0), -- Cuti Sakit
(8, 3, 2024, 90, 0), -- Cuti Melahirkan
(8, 4, 2024, 3, 0),  -- Cuti Menikah
(8, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis Anak
(8, 6, 2024, 3, 0),  -- Cuti Kematian Keluarga
(8, 7, 2024, 25, 0), -- Cuti Haji/Umroh
(8, 8, 2024, 30, 0), -- Cuti Besar

-- Budi Santoso (user_id: 10)
(10, 1, 2024, 12, 0), -- Cuti Tahunan
(10, 2, 2024, 30, 0), -- Cuti Sakit
(10, 4, 2024, 3, 0),  -- Cuti Menikah
(10, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis Anak
(10, 6, 2024, 3, 0),  -- Cuti Kematian Keluarga
(10, 7, 2024, 25, 0), -- Cuti Haji/Umroh
(10, 8, 2024, 30, 0), -- Cuti Besar

-- Dewi Lestari (user_id: 11)
(11, 1, 2024, 12, 0), -- Cuti Tahunan
(11, 2, 2024, 30, 0), -- Cuti Sakit
(11, 3, 2024, 90, 0), -- Cuti Melahirkan
(11, 4, 2024, 3, 0),  -- Cuti Menikah
(11, 5, 2024, 2, 0),  -- Cuti Khitan/Baptis Anak
(11, 6, 2024, 3, 0),  -- Cuti Kematian Keluarga
(11, 7, 2024, 25, 0), -- Cuti Haji/Umroh
(11, 8, 2024, 30, 0); -- Cuti Besar

-- Insert approval flow untuk setiap lembaga dan jenis cuti yang memerlukan approval berjenjang
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

-- Insert sample cuti applications
INSERT INTO cuti (user_id, jenis_cuti_id, tanggal_mulai, tanggal_selesai, alasan, status) VALUES
-- John Doe applications
(3, 1, '2024-03-15', '2024-03-17', 'Liburan keluarga ke Bali', 'disetujui'),
(3, 2, '2024-02-20', '2024-02-21', 'Demam dan flu', 'disetujui'),
(3, 1, '2024-12-24', '2024-12-26', 'Liburan Natal bersama keluarga', 'pending'),

-- Jane Smith applications
(4, 1, '2024-01-10', '2024-01-12', 'Acara keluarga', 'disetujui'),
(4, 2, '2024-11-15', '2024-11-16', 'Kontrol kesehatan rutin', 'pending'),

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
(3, 'Pengajuan cuti tahunan Anda telah disetujui', TRUE),
(3, 'Pengajuan cuti sakit Anda telah disetujui', TRUE),
(3, 'Pengajuan cuti tahunan baru menunggu persetujuan', FALSE),
(4, 'Pengajuan cuti tahunan Anda telah disetujui', TRUE),
(4, 'Pengajuan cuti sakit menunggu persetujuan', FALSE),
(7, 'Pengajuan cuti sakit Anda telah disetujui', TRUE),
(7, 'Pengajuan cuti tahunan sedang dalam proses', FALSE),
(8, 'Pengajuan cuti tahunan menunggu persetujuan', FALSE),
(10, 'Pengajuan cuti tahunan Anda ditolak', FALSE),
(11, 'Pengajuan cuti sakit menunggu persetujuan', FALSE),
-- Notifications for approvers
(2, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE),
(5, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE),
(6, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE),
(9, 'Ada pengajuan cuti baru yang perlu Anda review', FALSE);
