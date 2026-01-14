/*
  Warnings:

  - You are about to drop the column `pricePerBed` on the `hostel_accommodation_table` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerBed` on the `hotel_accommodation_table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `accomodation_facilities` ADD COLUMN `employedUserPrice` DOUBLE NULL,
    ADD COLUMN `selfEmployedUserPrice` DOUBLE NULL,
    ADD COLUMN `unemployedUserPrice` DOUBLE NULL;

-- AlterTable
ALTER TABLE `hostel_accommodation_table` DROP COLUMN `pricePerBed`;

-- AlterTable
ALTER TABLE `hotel_accommodation_table` DROP COLUMN `pricePerBed`;
