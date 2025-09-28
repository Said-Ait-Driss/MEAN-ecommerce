/*
  Warnings:

  - Added the required column `phone_code` to the `Cleaner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_code` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Cleaner" ADD COLUMN     "date_of_birth" TEXT,
ADD COLUMN     "phone_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "date_of_birth" TEXT,
ADD COLUMN     "phone_code" TEXT NOT NULL;
