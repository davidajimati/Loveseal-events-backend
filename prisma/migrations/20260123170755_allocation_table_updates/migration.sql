-- AlterTable
ALTER TABLE `hostel_allocations_table` MODIFY `allocationStatus` ENUM('ACTIVE', 'REVOKED', 'PENDING') NOT NULL;
