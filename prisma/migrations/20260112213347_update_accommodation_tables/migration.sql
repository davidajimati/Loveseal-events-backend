/*
  Warnings:

  - Added the required column `noOfRoomsAvailable` to the `hotel_accommodation_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfRoomsOccupied` to the `hotel_accommodation_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hotel_accommodation_table` ADD COLUMN `noOfRoomsAvailable` INTEGER NOT NULL,
    ADD COLUMN `noOfRoomsOccupied` INTEGER NOT NULL;
