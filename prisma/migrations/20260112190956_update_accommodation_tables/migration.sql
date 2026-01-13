/*
  Warnings:

  - You are about to drop the `accommodation_facilities_table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `accomodation_facilities` DROP FOREIGN KEY `accomodation_facilities_accommodationCategoryId_fkey`;

-- DropIndex
DROP INDEX `accomodation_facilities_accommodationCategoryId_fkey` ON `accomodation_facilities`;

-- DropTable
DROP TABLE `accommodation_facilities_table`;

-- CreateTable
CREATE TABLE `accommodation_categories` (
    `accommodationCategoryId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`accommodationCategoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accomodation_facilities` ADD CONSTRAINT `accomodation_facilities_accommodationCategoryId_fkey` FOREIGN KEY (`accommodationCategoryId`) REFERENCES `accommodation_categories`(`accommodationCategoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;
