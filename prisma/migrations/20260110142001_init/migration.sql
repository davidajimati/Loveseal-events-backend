/*
  Warnings:

  - You are about to drop the `user_information` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user_information`;

-- CreateTable
CREATE TABLE `loveseal_events_user_info_table` (
    `userId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `emailVerified` BOOLEAN NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `ageRange` VARCHAR(191) NULL,
    `localAssembly` VARCHAR(191) NULL,
    `maritalStatus` ENUM('SINGLE', 'MARRIED', 'SEPARATED', 'DIVORCED', 'WIDOWED') NULL,
    `employmentStatus` ENUM('UNEMPLOYED', 'EMPLOYED', 'SELF_EMPLOYED') NULL DEFAULT 'EMPLOYED',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `stateOfResidence` VARCHAR(191) NULL,

    UNIQUE INDEX `loveseal_events_user_info_table_email_key`(`email`),
    INDEX `userInfoIndex`(`userId`, `email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_log_table` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `otpReference` VARCHAR(191) NOT NULL,
    `otpReason` VARCHAR(191) NOT NULL,
    `otpUsed` BOOLEAN NULL DEFAULT false,
    `timeGenerated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timeUsed` DATETIME(3) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_users_table` (
    `adminUserId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'ADMIN', 'SPECTATOR', 'EVENT_MANAGER', 'FINANCE_ADMIN', 'ACCOMMODATION_ADMIN') NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `admin_users_table_email_key`(`email`),
    UNIQUE INDEX `admin_users_table_tenantId_adminUserId_key`(`tenantId`, `adminUserId`),
    PRIMARY KEY (`adminUserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events_admin_role_table` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `adminUserId` VARCHAR(191) NOT NULL,
    `eventRole` ENUM('SUPERADMIN', 'ADMIN', 'SPECTATOR', 'EVENT_MANAGER', 'FINANCE_ADMIN', 'ACCOMMODATION_ADMIN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loveseal_events_table` (
    `eventId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `eventOwnerId` VARCHAR(191) NOT NULL,
    `eventYear` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `eventStatus` ENUM('DRAFT', 'ACTIVE', 'CLOSED') NOT NULL,
    `accommodationNeeded` BOOLEAN NOT NULL,
    `registrationOpenAt` DATETIME(3) NOT NULL,
    `registrationCloseAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `eventInfoIndex`(`eventId`, `tenantId`, `eventOwnerId`),
    PRIMARY KEY (`eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_registrations_table` (
    `regId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NULL DEFAULT 'PENDING',
    `registrationCompleted` BOOLEAN NULL,
    `participationMode` ENUM('CAMPER', 'ATTENDEE', 'ONLINE') NOT NULL,
    `intiator` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `accommodationType` ENUM('HOSTEL', 'HOTEL', 'NONE') NULL DEFAULT 'NONE',
    `accommodationAssigned` BOOLEAN NOT NULL,
    `accommodationDetails` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `eventRegIndex`(`eventId`),
    PRIMARY KEY (`regId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_payment_records` (
    `paymentId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `paymentReason` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currencyCode` VARCHAR(191) NULL DEFAULT 'NGN',
    `paymentReference` VARCHAR(191) NOT NULL,
    `paymentStatus` ENUM('PENDING', 'SUCCESSFUL', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `paymentRecordsIndex`(`eventId`),
    PRIMARY KEY (`paymentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accomodation_facilities` (
    `facilityId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `facilityName` VARCHAR(191) NOT NULL,
    `available` BOOLEAN NOT NULL,

    PRIMARY KEY (`facilityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_accommodation_table` (
    `roomId` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `roomCode` VARCHAR(191) NOT NULL,
    `roomIdentifier` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `pricePerBed` DOUBLE NOT NULL,
    `genderRestriction` ENUM('MALE', 'FEMALE') NOT NULL,
    `adminReserverd` BOOLEAN NOT NULL,

    PRIMARY KEY (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_allocations_table` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `registrationId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `allocator` ENUM('ADMIN', 'ALGORITHM') NOT NULL,
    `allocatedAt` DATETIME(3) NOT NULL,
    `allocationStatus` ENUM('ACTIVE', 'REVOKED') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_accommodation_table` (
    `hotelId` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `hotelCode` VARCHAR(191) NOT NULL,
    `hotelIdentifier` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `available` BOOLEAN NULL,
    `pricePerBed` DOUBLE NOT NULL,
    `genderRestriction` ENUM('MALE', 'FEMALE') NOT NULL,
    `adminReserverd` BOOLEAN NOT NULL,

    PRIMARY KEY (`hotelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `events_admin_role_table` ADD CONSTRAINT `events_admin_role_table_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events_admin_role_table` ADD CONSTRAINT `events_admin_role_table_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `admin_users_table`(`adminUserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loveseal_events_table` ADD CONSTRAINT `loveseal_events_table_tenantId_eventOwnerId_fkey` FOREIGN KEY (`tenantId`, `eventOwnerId`) REFERENCES `admin_users_table`(`tenantId`, `adminUserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_registrations_table` ADD CONSTRAINT `event_registrations_table_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `loveseal_events_user_info_table`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_registrations_table` ADD CONSTRAINT `event_registrations_table_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_payment_records` ADD CONSTRAINT `event_payment_records_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `loveseal_events_user_info_table`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_payment_records` ADD CONSTRAINT `event_payment_records_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accomodation_facilities` ADD CONSTRAINT `accomodation_facilities_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hostel_accommodation_table` ADD CONSTRAINT `hostel_accommodation_table_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `accomodation_facilities`(`facilityId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_accommodation_table` ADD CONSTRAINT `hotel_accommodation_table_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `accomodation_facilities`(`facilityId`) ON DELETE RESTRICT ON UPDATE CASCADE;
