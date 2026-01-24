/*
  Warnings:

  - A unique constraint covering the columns `[paymentReference]` on the table `hostel_allocations_table` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `hostel_allocations_table_paymentReference_key` ON `hostel_allocations_table`(`paymentReference`);
