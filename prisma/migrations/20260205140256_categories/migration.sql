-- AlterTable
ALTER TABLE `accommodation_categories` MODIFY `name` ENUM('HOSTEL', 'HOTEL', 'NONE', 'SHARED_APARTMENT') NOT NULL;

-- AlterTable
ALTER TABLE `event_registrations_table` MODIFY `accommodationType` ENUM('HOSTEL', 'HOTEL', 'NONE', 'SHARED_APARTMENT') NULL DEFAULT 'NONE';
