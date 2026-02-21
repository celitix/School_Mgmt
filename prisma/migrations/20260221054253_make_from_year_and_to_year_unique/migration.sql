/*
  Warnings:

  - A unique constraint covering the columns `[from_year,to_year]` on the table `academic_years` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `academic_years_from_year_to_year_key` ON `academic_years`(`from_year`, `to_year`);
