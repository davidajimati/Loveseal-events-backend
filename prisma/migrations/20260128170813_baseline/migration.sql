-- CreateTable
CREATE TABLE `loveseal_events_user_info_table` (
    `userId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `emailVerified` BOOLEAN NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `ageRange` VARCHAR(191) NULL,
    `localAssembly` VARCHAR(191) NULL,
    `maritalStatus` ENUM('SINGLE', 'MARRIED', 'SEPARATED', 'DIVORCED', 'WIDOWED') NULL,
    `employmentStatus` ENUM('UNEMPLOYED', 'EMPLOYED', 'SELF_EMPLOYED') NULL DEFAULT 'EMPLOYED',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `stateOfResidence` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `minister` BOOLEAN NULL DEFAULT false,
    `residentialAddress` VARCHAR(191) NULL,

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
    `tenantId` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'ADMIN', 'SPECTATOR', 'EVENT_MANAGER', 'FINANCE_ADMIN', 'ACCOMMODATION_ADMIN') NULL,
    `userName` VARCHAR(191) NULL,
    `dateCreated` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

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

    INDEX `idx_events_admin_role_adminUserId`(`adminUserId`),
    INDEX `idx_events_admin_role_eventId`(`eventId`),
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
    INDEX `idx_loveseal_events_table_tenantId_eventOwnerId_fkey`(`tenantId`, `eventOwnerId`),
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
    INDEX `idx_event_registrations_table_userId_fkey`(`userId`),
    UNIQUE INDEX `eventRegEventUserUnique`(`eventId`, `userId`),
    PRIMARY KEY (`regId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registrant_dependants_table` (
    `id` VARCHAR(191) NOT NULL,
    `parentRegId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `paymentStatus` ENUM('PENDING', 'SUCCESSFUL', 'FAILED') NULL DEFAULT 'PENDING',
    `amount` BIGINT NULL DEFAULT 5000,
    `dateCreated` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `registrant_dependants_table_eventId_fkey`(`eventId`),
    INDEX `registrant_dependants_table_parentRegId_fkey`(`parentRegId`),
    PRIMARY KEY (`id`)
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
    `providerRawResponse` JSON NULL,
    `paymentStatus` ENUM('PENDING', 'SUCCESSFUL', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `event_payment_records_paymentReference_key`(`paymentReference`),
    INDEX `paymentRecordsIndex`(`eventId`),
    INDEX `idx_event_payment_records_userId_fkey`(`userId`),
    PRIMARY KEY (`paymentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accomodation_facilities` (
    `facilityId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `facilityName` VARCHAR(191) NOT NULL,
    `available` BOOLEAN NOT NULL,
    `accommodationCategoryId` VARCHAR(191) NOT NULL,
    `capacityOccupied` INTEGER NOT NULL DEFAULT 0,
    `employedUserPrice` DOUBLE NULL,
    `selfEmployedUserPrice` DOUBLE NULL,
    `totalCapacity` INTEGER NOT NULL,
    `unemployedUserPrice` DOUBLE NULL,

    INDEX `idx_accomodation_facilities_accommodationCategoryId_fkey`(`accommodationCategoryId`),
    INDEX `idx_accomodation_facilities_eventId_fkey`(`eventId`),
    PRIMARY KEY (`facilityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_accommodation_table` (
    `roomId` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `roomCode` VARCHAR(191) NOT NULL,
    `roomIdentifier` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `genderRestriction` ENUM('MALE', 'FEMALE') NOT NULL,
    `adminReserved` BOOLEAN NOT NULL,
    `capacityOccupied` INTEGER NOT NULL DEFAULT 0,

    INDEX `idx_hostel_accommodation_table_facilityId_fkey`(`facilityId`),
    PRIMARY KEY (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_allocations_table` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `registrationId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `paymentReference` VARCHAR(191) NOT NULL,
    `allocator` ENUM('ADMIN', 'ALGORITHM') NOT NULL,
    `allocatedAt` DATETIME(3) NOT NULL,
    `allocationStatus` ENUM('ACTIVE', 'PENDING', 'REVOKED') NOT NULL,

    UNIQUE INDEX `hostel_allocations_table_paymentReference_key`(`paymentReference`),
    INDEX `paymentReferenceIndex`(`paymentReference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_allocations_table` (
    `id` VARCHAR(191) NOT NULL,
    `hotelRoomId` VARCHAR(191) NOT NULL,
    `registrationId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `paymentReference` VARCHAR(191) NOT NULL,
    `allocator` ENUM('ADMIN', 'ALGORITHM') NOT NULL,
    `allocatedAt` DATETIME(3) NOT NULL,
    `allocationStatus` ENUM('ACTIVE', 'PENDING', 'REVOKED') NOT NULL,

    UNIQUE INDEX `hotel_allocations_table_paymentReference_key`(`paymentReference`),
    INDEX `paymentReferenceIndex`(`paymentReference`),
    INDEX `hotel_allocations_table_hotelRoomId_fkey`(`hotelRoomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_accommodation_table` (
    `roomTypeId` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `roomType` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `available` BOOLEAN NULL,
    `genderRestriction` ENUM('MALE', 'FEMALE') NOT NULL,
    `adminReserved` BOOLEAN NOT NULL,
    `noOfRoomsAvailable` INTEGER NOT NULL,
    `noOfRoomsOccupied` INTEGER NOT NULL DEFAULT 0,
    `price` DOUBLE NULL,

    INDEX `idx_hotel_accommodation_table_facilityId_fkey`(`facilityId`),
    PRIMARY KEY (`roomTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accommodation_categories` (
    `accommodationCategoryId` VARCHAR(191) NOT NULL,
    `name` ENUM('HOSTEL', 'HOTEL', 'NONE') NOT NULL,

    PRIMARY KEY (`accommodationCategoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `events_admin_role_table` ADD CONSTRAINT `events_admin_role_table_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `admin_users_table`(`adminUserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events_admin_role_table` ADD CONSTRAINT `events_admin_role_table_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loveseal_events_table` ADD CONSTRAINT `loveseal_events_table_tenantId_eventOwnerId_fkey` FOREIGN KEY (`tenantId`, `eventOwnerId`) REFERENCES `admin_users_table`(`tenantId`, `adminUserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_registrations_table` ADD CONSTRAINT `event_registrations_table_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_registrations_table` ADD CONSTRAINT `event_registrations_table_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `loveseal_events_user_info_table`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registrant_dependants_table` ADD CONSTRAINT `registrant_dependants_table_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registrant_dependants_table` ADD CONSTRAINT `registrant_dependants_table_parentRegId_fkey` FOREIGN KEY (`parentRegId`) REFERENCES `event_registrations_table`(`regId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_payment_records` ADD CONSTRAINT `event_payment_records_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_payment_records` ADD CONSTRAINT `event_payment_records_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `loveseal_events_user_info_table`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accomodation_facilities` ADD CONSTRAINT `accomodation_facilities_accommodationCategoryId_fkey` FOREIGN KEY (`accommodationCategoryId`) REFERENCES `accommodation_categories`(`accommodationCategoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accomodation_facilities` ADD CONSTRAINT `accomodation_facilities_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `loveseal_events_table`(`eventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hostel_accommodation_table` ADD CONSTRAINT `hostel_accommodation_table_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `accomodation_facilities`(`facilityId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_allocations_table` ADD CONSTRAINT `hotel_allocations_table_hotelRoomId_fkey` FOREIGN KEY (`hotelRoomId`) REFERENCES `hotel_accommodation_table`(`roomTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_accommodation_table` ADD CONSTRAINT `hotel_accommodation_table_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `accomodation_facilities`(`facilityId`) ON DELETE RESTRICT ON UPDATE CASCADE;
