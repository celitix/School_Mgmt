/*
  Warnings:

  - You are about to drop the column `teacher_id` on the `salary_structures` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `salary_structures` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `salary_structures` DROP FOREIGN KEY `salary_structures_teacher_id_fkey`;

-- DropIndex
DROP INDEX `salary_structures_teacher_id_fkey` ON `salary_structures`;

-- AlterTable
ALTER TABLE `salary_structures` DROP COLUMN `teacher_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `salary_structures` ADD CONSTRAINT `salary_structures_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
