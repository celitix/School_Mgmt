-- AlterTable
ALTER TABLE `gurdians` ADD COLUMN `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `student_gurdians` ADD COLUMN `isPrimary` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `alt_phone_1` VARCHAR(191) NULL,
    ADD COLUMN `alt_phone_2` VARCHAR(191) NULL;
