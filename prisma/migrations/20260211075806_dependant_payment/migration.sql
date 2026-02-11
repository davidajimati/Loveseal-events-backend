/*
  Warnings:

  - A unique constraint covering the columns `[paymentReference]` on the table `registrant_dependants_table` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `registrant_dependants_table` ADD COLUMN `paymentReference` VARCHAR(191) NULL,
    MODIFY `amount` BIGINT NULL DEFAULT 7000;

-- CreateIndex
CREATE UNIQUE INDEX `registrant_dependants_table_paymentReference_key` ON `registrant_dependants_table`(`paymentReference`);
