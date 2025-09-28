-- AlterTable
ALTER TABLE "public"."Cleaner" ALTER COLUMN "salt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "salt" DROP DEFAULT;
