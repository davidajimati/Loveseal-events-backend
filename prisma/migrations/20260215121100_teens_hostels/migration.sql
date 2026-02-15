-- AlterTable
ALTER TABLE `hostel_accommodation_table` ADD COLUMN `teenagersRoom` BOOLEAN NULL,
    MODIFY `genderRestriction` ENUM('MALE', 'FEMALE') NULL;
