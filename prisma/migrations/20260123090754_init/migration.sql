/*
  Warnings:

  - You are about to alter the column `name` on the `accommodation_categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(15))`.

*/
-- AlterTable
ALTER TABLE `accommodation_categories` MODIFY `name` ENUM('HOSTEL', 'HOTEL', 'NONE') NOT NULL;
