-- AlterTable
ALTER TABLE `User` ADD COLUMN `wechatOpenId` VARCHAR(191) NULL,
    ADD COLUMN `wechatUnionId` VARCHAR(191) NULL,
    ADD COLUMN `wechatNickName` VARCHAR(191) NULL,
    ADD COLUMN `wechatAvatar` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_wechatOpenId_key` ON `User`(`wechatOpenId`);

