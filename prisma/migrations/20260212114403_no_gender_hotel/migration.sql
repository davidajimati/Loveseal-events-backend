-- AlterTable
ALTER TABLE `hotel_accommodation_table` MODIFY `genderRestriction` ENUM('MALE', 'FEMALE') NULL;

-- AlterTable
ALTER TABLE `registrant_dependants_table` MODIFY `gender` ENUM('MALE', 'FEMALE') NULL;
