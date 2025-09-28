-- AlterTable
ALTER TABLE "public"."Cleaner" ADD COLUMN     "email_verification_expires" TEXT,
ADD COLUMN     "email_verification_token" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "email_verification_expires" TEXT,
ADD COLUMN     "email_verification_token" TEXT,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
