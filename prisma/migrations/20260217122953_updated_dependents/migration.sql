-- DropIndex
DROP INDEX `registrant_dependants_table_paymentReference_key` ON `registrant_dependants_table`;

-- CreateIndex
CREATE INDEX `registrant_dependants_table_paymentReference_idx` ON `registrant_dependants_table`(`paymentReference`);
