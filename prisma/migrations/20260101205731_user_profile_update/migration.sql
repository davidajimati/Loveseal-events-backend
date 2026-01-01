/*
  Warnings:

  - Added the required column `gender` to the `user_information` table without a default value. This is not possible if the table is not empty.
  - Made the column `phoneNumber` on table `user_information` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user_information` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `employmentStatus` ENUM('UNEMPLOYED', 'EMPLOYED', 'SELF_EMPLOYED') NOT NULL DEFAULT 'EMPLOYED',
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    ADD COLUMN `localAssembly` VARCHAR(191) NULL,
    ADD COLUMN `maritalStatus` ENUM('SINGLE', 'MARRIED') NULL,
    MODIFY `phoneNumber` VARCHAR(191) NOT NULL;
