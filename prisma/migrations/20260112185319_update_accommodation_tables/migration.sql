/*
  Warnings:

  - Added the required column `accommodationCategoryId` to the `accomodation_facilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accomodation_facilities` ADD COLUMN `accommodationCategoryId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `accommodation_facilities_table` (
    `accommodationCategoryId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`accommodationCategoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accomodation_facilities` ADD CONSTRAINT `accomodation_facilities_accommodationCategoryId_fkey` FOREIGN KEY (`accommodationCategoryId`) REFERENCES `accommodation_facilities_table`(`accommodationCategoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;
