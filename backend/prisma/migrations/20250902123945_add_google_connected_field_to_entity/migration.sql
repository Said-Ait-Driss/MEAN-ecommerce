-- AlterTable
ALTER TABLE "public"."Cleaner" ADD COLUMN     "google_connected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "google_connected" BOOLEAN NOT NULL DEFAULT false;
