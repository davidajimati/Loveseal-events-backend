/*
  Warnings:

  - Made the column `totalCapacity` on table `accomodation_facilities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `accomodation_facilities` MODIFY `totalCapacity` INTEGER NOT NULL;
