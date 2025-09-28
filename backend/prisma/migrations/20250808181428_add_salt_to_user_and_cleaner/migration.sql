-- AlterTable
ALTER TABLE "public"."Cleaner" ADD COLUMN     "salt" TEXT NOT NULL DEFAULT 'ggg';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "salt" TEXT NOT NULL DEFAULT 'ggg';
