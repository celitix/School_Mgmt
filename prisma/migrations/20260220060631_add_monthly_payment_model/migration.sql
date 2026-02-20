/*
  Warnings:

  - You are about to drop the column `net_salary` on the `salary_structures` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `salary_structures` DROP COLUMN `net_salary`;

-- CreateTable
CREATE TABLE `salary_payments` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `salary_structure_id` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `basic` DOUBLE NOT NULL,
    `hra` DOUBLE NULL,
    `allowance` DOUBLE NULL,
    `fixedDeductions` DOUBLE NOT NULL DEFAULT 0,
    `variableDeductions` DOUBLE NOT NULL DEFAULT 0,
    `bonus` DOUBLE NOT NULL DEFAULT 0,
    `grossSalary` DOUBLE NOT NULL,
    `netSalary` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'PAID') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `salary_payments_user_id_month_year_key`(`user_id`, `month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salary_adjustments` (
    `id` VARCHAR(191) NOT NULL,
    `salary_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('ALLOWANCE', 'DEDUCTION') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `salary_adjustments_salary_id_idx`(`salary_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `salary_structures_user_id_effective_from_effective_to_idx` ON `salary_structures`(`user_id`, `effective_from`, `effective_to`);

-- AddForeignKey
ALTER TABLE `salary_payments` ADD CONSTRAINT `salary_payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salary_adjustments` ADD CONSTRAINT `salary_adjustments_salary_id_fkey` FOREIGN KEY (`salary_id`) REFERENCES `salary_payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
