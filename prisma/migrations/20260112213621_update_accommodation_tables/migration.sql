/*
  Warnings:

  - Added the required column `capacityOccupied` to the `hostel_accommodation_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hostel_accommodation_table` ADD COLUMN `capacityOccupied` INTEGER NOT NULL;
