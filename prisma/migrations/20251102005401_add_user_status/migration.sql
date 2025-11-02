-- AlterTable
ALTER TABLE `User` ADD COLUMN `status` VARCHAR(191) NULL,
    ADD COLUMN `statusUpdatedAt` DATETIME(3) NULL;
