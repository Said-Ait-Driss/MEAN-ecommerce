/*
  Warnings:

  - You are about to drop the column `booking_time` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `booking_end_date` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "booking_time",
ADD COLUMN     "booking_end_date" TIMESTAMP(3) NOT NULL;
