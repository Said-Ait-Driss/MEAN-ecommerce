-- AlterTable
ALTER TABLE "public"."CleanerNotification" ALTER COLUMN "booking_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserNotification" ADD COLUMN     "booking_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."UserNotification" ADD CONSTRAINT "UserNotification_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CleanerNotification" ADD CONSTRAINT "CleanerNotification_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
