/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `gurdians` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gurdians` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `roles_name_key` ON `roles`(`name`);

-- AddForeignKey
ALTER TABLE `gurdians` ADD CONSTRAINT `gurdians_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
