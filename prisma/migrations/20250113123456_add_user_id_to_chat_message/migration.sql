-- AlterTable
ALTER TABLE `my_doggy_love`.`ChatMessage` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddIndex
CREATE INDEX `ChatMessage_userId_idx` ON `my_doggy_love`.`ChatMessage`(`userId`);

-- AddForeignKey
ALTER TABLE `my_doggy_love`.`ChatMessage` ADD CONSTRAINT `ChatMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `my_doggy_love`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
