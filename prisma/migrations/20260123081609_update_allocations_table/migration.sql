/*
  Warnings:

  - Added the required column `paymentReference` to the `hostel_allocations_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hostel_allocations_table` ADD COLUMN `paymentReference` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `eventRegEventUserIndex` ON `event_registrations_table`(`eventId`, `userId`);

-- CreateIndex
CREATE INDEX `paymentReferenceIndex` ON `hostel_allocations_table`(`paymentReference`);
