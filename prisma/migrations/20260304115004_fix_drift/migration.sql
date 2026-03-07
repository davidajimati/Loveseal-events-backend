/*
  Warnings:

  - You are about to drop the column `paymentRequired` on the `registrant_dependants_table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `registrant_dependants_table` DROP COLUMN `paymentRequired`,
    MODIFY `amount` BIGINT NULL DEFAULT 7000;
