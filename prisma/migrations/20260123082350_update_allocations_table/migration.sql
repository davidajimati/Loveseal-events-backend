/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId]` on the table `event_registrations_table` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `event_registrations_table` DROP FOREIGN KEY `event_registrations_table_eventId_fkey`;

-- DropIndex
DROP INDEX `eventRegEventUserIndex` ON `event_registrations_table`;

-- CreateIndex
CREATE UNIQUE INDEX `eventRegEventUserUnique` ON `event_registrations_table`(`eventId`, `userId`);

-- AddForeignKey
ALTER TABLE `event_registrations_table` ADD CONSTRAINT `event_registrations_table_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;
