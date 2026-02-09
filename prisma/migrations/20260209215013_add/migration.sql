/*
  Warnings:

  - A unique constraint covering the columns `[paymentReference]` on the table `registrant_dependants_table` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `registrant_dependants_table_updatedAt_key` ON `registrant_dependants_table`;

-- CreateIndex
CREATE UNIQUE INDEX `registrant_dependants_table_paymentReference_key` ON `registrant_dependants_table`(`paymentReference`);
