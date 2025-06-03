/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
