/*
  Warnings:

  - You are about to drop the column `booking_date` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `booking_start_date` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "booking_date",
ADD COLUMN     "booking_start_date" TIMESTAMP(3) NOT NULL;
