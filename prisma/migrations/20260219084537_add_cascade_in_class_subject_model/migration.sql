-- DropForeignKey
ALTER TABLE `class_subjects` DROP FOREIGN KEY `class_subjects_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `class_subjects` DROP FOREIGN KEY `class_subjects_subject_id_fkey`;

-- DropIndex
DROP INDEX `class_subjects_subject_id_fkey` ON `class_subjects`;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
