/*
  Warnings:

  - Added the required column `booking_id` to the `CleanerNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CleanerNotification" ADD COLUMN     "booking_id" TEXT NOT NULL;
