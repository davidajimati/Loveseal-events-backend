/*
  Warnings:

  - A unique constraint covering the columns `[paymentReference]` on the table `event_payment_records` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `event_payment_records_paymentReference_key` ON `event_payment_records`(`paymentReference`);
