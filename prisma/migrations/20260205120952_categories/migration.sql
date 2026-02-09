/*
  Warnings:

  - You are about to drop the column `intiator` on the `event_registrations_table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `accommodation_categories` ADD COLUMN `eventId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `event_registrations_table` DROP COLUMN `intiator`,
    ADD COLUMN `initiator` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE `loveseal_events_table` ADD COLUMN `venue` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `accommodation_categories` ADD CONSTRAINT `accommodation_categories_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `hostel_allocations_table` RENAME INDEX `paymentReferenceIndex` TO `idx_paymentReferenceIndex`;

-- RenameIndex
ALTER TABLE `hotel_allocations_table` RENAME INDEX `hotel_allocations_table_hotelRoomId_fkey` TO `idx_hotel_allocations_table_hotelRoomId_fkey`;

-- RenameIndex
ALTER TABLE `hotel_allocations_table` RENAME INDEX `paymentReferenceIndex` TO `idx_hotel_allocaton_paymentReferenceIndex`;

-- RenameIndex
ALTER TABLE `registrant_dependants_table` RENAME INDEX `registrant_dependants_table_eventId_fkey` TO `idx_registrant_dependants_table_eventId_fkey`;

-- RenameIndex
ALTER TABLE `registrant_dependants_table` RENAME INDEX `registrant_dependants_table_parentRegId_fkey` TO `idx_registrant_dependants_table_parentRegId_fkey`;
