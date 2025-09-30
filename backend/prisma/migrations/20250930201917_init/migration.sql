/*
  Warnings:

  - The primary key for the `UserNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `booking_id` on the `UserNotification` table. All the data in the column will be lost.
  - The `id` column on the `UserNotification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cleaner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CleanerBlockedUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CleanerNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteCleaner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBlockedCleaners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookingServices` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `user_id` on the `UserNotification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_cleaner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CleanerBlockedUsers" DROP CONSTRAINT "CleanerBlockedUsers_cleaner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CleanerBlockedUsers" DROP CONSTRAINT "CleanerBlockedUsers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CleanerNotification" DROP CONSTRAINT "CleanerNotification_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CleanerNotification" DROP CONSTRAINT "CleanerNotification_cleaner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."FavoriteCleaner" DROP CONSTRAINT "FavoriteCleaner_cleaner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."FavoriteCleaner" DROP CONSTRAINT "FavoriteCleaner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_cleaner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_cleaner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserBlockedCleaners" DROP CONSTRAINT "UserBlockedCleaners_cleaner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserBlockedCleaners" DROP CONSTRAINT "UserBlockedCleaners_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BookingServices" DROP CONSTRAINT "_BookingServices_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BookingServices" DROP CONSTRAINT "_BookingServices_B_fkey";

-- AlterTable
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_pkey",
DROP COLUMN "booking_id",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Booking";

-- DropTable
DROP TABLE "public"."Cleaner";

-- DropTable
DROP TABLE "public"."CleanerBlockedUsers";

-- DropTable
DROP TABLE "public"."CleanerNotification";

-- DropTable
DROP TABLE "public"."FavoriteCleaner";

-- DropTable
DROP TABLE "public"."Review";

-- DropTable
DROP TABLE "public"."Service";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."UserBlockedCleaners";

-- DropTable
DROP TABLE "public"."_BookingServices";

-- DropEnum
DROP TYPE "public"."BookingStatus";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" TEXT,
    "email_verification_expires" TEXT,
    "google_connected" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cart_items" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "public"."carts"("userId");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNotification" ADD CONSTRAINT "UserNotification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
