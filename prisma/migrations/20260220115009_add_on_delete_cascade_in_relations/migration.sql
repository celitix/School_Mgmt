-- DropForeignKey
ALTER TABLE `salary_adjustments` DROP FOREIGN KEY `salary_adjustments_salary_id_fkey`;

-- DropForeignKey
ALTER TABLE `salary_payments` DROP FOREIGN KEY `salary_payments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_gurdians` DROP FOREIGN KEY `student_gurdians_gurdian_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetables` DROP FOREIGN KEY `timetables_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetables` DROP FOREIGN KEY `timetables_section_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetables` DROP FOREIGN KEY `timetables_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetables` DROP FOREIGN KEY `timetables_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `timetables` DROP FOREIGN KEY `timetables_time_slot_id_fkey`;

-- DropIndex
DROP INDEX `student_gurdians_gurdian_id_fkey` ON `student_gurdians`;

-- DropIndex
DROP INDEX `timetables_section_id_fkey` ON `timetables`;

-- DropIndex
DROP INDEX `timetables_subject_id_fkey` ON `timetables`;

-- DropIndex
DROP INDEX `timetables_time_slot_id_fkey` ON `timetables`;

-- AddForeignKey
ALTER TABLE `student_gurdians` ADD CONSTRAINT `student_gurdians_gurdian_id_fkey` FOREIGN KEY (`gurdian_id`) REFERENCES `gurdians`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salary_payments` ADD CONSTRAINT `salary_payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salary_adjustments` ADD CONSTRAINT `salary_adjustments_salary_id_fkey` FOREIGN KEY (`salary_id`) REFERENCES `salary_payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetables` ADD CONSTRAINT `timetables_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetables` ADD CONSTRAINT `timetables_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetables` ADD CONSTRAINT `timetables_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetables` ADD CONSTRAINT `timetables_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timetables` ADD CONSTRAINT `timetables_time_slot_id_fkey` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
