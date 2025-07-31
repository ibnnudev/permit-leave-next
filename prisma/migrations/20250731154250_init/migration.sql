-- CreateTable
CREATE TABLE `Institution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `institution_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `whatsapp_number` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `birth_place` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `join_date` DATETIME(3) NOT NULL,
    `marital_status` VARCHAR(191) NOT NULL,
    `employment_status` VARCHAR(191) NOT NULL,
    `personal_email` VARCHAR(191) NOT NULL,
    `institution_email` VARCHAR(191) NOT NULL,
    `religion` VARCHAR(191) NOT NULL,
    `last_education` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `max_days` INTEGER NOT NULL,
    `require_document` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hierarchical` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leave` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'IN_PROCESS', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'IN_PROCESS',
    `last_processed_level` INTEGER NOT NULL,
    `admin_notes` VARCHAR(191) NULL,
    `recorded_by` VARCHAR(191) NULL,
    `approved_by_id` INTEGER NULL,
    `document` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveQuota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `total_quota` INTEGER NOT NULL,
    `used_quota` INTEGER NOT NULL,

    UNIQUE INDEX `LeaveQuota_employee_id_leave_type_id_year_key`(`employee_id`, `leave_type_id`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalFlow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `institution_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NULL,
    `level` INTEGER NOT NULL,
    `created_by_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalFlowEmployee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `approval_flow_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leave_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'AUTO_APPROVED') NOT NULL DEFAULT 'PENDING',
    `notes` VARCHAR(191) NULL,
    `approval_date` DATETIME(3) NULL,
    `approval_deadline` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `Institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_leave_type_id_fkey` FOREIGN KEY (`leave_type_id`) REFERENCES `LeaveType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_approved_by_id_fkey` FOREIGN KEY (`approved_by_id`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveQuota` ADD CONSTRAINT `LeaveQuota_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveQuota` ADD CONSTRAINT `LeaveQuota_leave_type_id_fkey` FOREIGN KEY (`leave_type_id`) REFERENCES `LeaveType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalFlow` ADD CONSTRAINT `ApprovalFlow_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `Institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalFlow` ADD CONSTRAINT `ApprovalFlow_leave_type_id_fkey` FOREIGN KEY (`leave_type_id`) REFERENCES `LeaveType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalFlow` ADD CONSTRAINT `ApprovalFlow_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalFlowEmployee` ADD CONSTRAINT `ApprovalFlowEmployee_approval_flow_id_fkey` FOREIGN KEY (`approval_flow_id`) REFERENCES `ApprovalFlow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalFlowEmployee` ADD CONSTRAINT `ApprovalFlowEmployee_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalLog` ADD CONSTRAINT `ApprovalLog_leave_id_fkey` FOREIGN KEY (`leave_id`) REFERENCES `Leave`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalLog` ADD CONSTRAINT `ApprovalLog_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
