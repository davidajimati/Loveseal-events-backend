-- DropIndex
DROP INDEX `registrant_dependants_table_paymentReference_key` ON `registrant_dependants_table`;

-- AlterTable
ALTER TABLE `loveseal_events_table` ADD COLUMN `forTeenagers` BOOLEAN NULL;

-- CreateIndex
CREATE INDEX `registrant_dependants_table_paymentReference_idx` ON `registrant_dependants_table`(`paymentReference`);
