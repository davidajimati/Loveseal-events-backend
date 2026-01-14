-- AlterTable
ALTER TABLE `accomodation_facilities` ADD COLUMN `capacityOccupied` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalCapacity` INTEGER NULL;
