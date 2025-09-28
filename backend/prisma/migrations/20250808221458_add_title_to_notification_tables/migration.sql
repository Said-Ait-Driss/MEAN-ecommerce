/*
  Warnings:

  - Added the required column `title` to the `CleanerNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `UserNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CleanerNotification" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserNotification" ADD COLUMN     "title" TEXT NOT NULL;
