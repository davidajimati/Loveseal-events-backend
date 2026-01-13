/*
  Warnings:

  - You are about to drop the column `adminReserverd` on the `hostel_accommodation_table` table. All the data in the column will be lost.
  - Added the required column `adminReserved` to the `hostel_accommodation_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hostel_accommodation_table` DROP COLUMN `adminReserverd`,
    ADD COLUMN `adminReserved` BOOLEAN NOT NULL;
