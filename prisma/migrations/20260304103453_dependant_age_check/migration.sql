-- DropIndex
DROP INDEX `registrant_dependants_table_paymentReference_key` ON `registrant_dependants_table`;

-- AlterTable
ALTER TABLE `registrant_dependants_table` ADD COLUMN `paymentRequired` BOOLEAN NULL,
    MODIFY `amount` BIGINT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `registrant_dependants_table_paymentReference_idx` ON `registrant_dependants_table`(`paymentReference`);
