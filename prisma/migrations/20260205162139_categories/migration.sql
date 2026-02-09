/*
  Warnings:

  - Made the column `eventId` on table `accommodation_categories` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `accommodation_categories` DROP FOREIGN KEY `accommodation_categories_eventId_fkey`;

-- DropIndex
DROP INDEX `accommodation_categories_eventId_fkey` ON `accommodation_categories`;

-- AlterTable
ALTER TABLE `accommodation_categories` MODIFY `eventId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `accommodation_categories` ADD CONSTRAINT `accommodation_categories_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;
