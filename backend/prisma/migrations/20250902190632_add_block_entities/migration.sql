-- CreateTable
CREATE TABLE "public"."UserBlockedCleaners" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cleaner_id" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBlockedCleaners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CleanerBlockedUsers" (
    "id" TEXT NOT NULL,
    "cleaner_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CleanerBlockedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBlockedCleaners_user_id_cleaner_id_key" ON "public"."UserBlockedCleaners"("user_id", "cleaner_id");

-- CreateIndex
CREATE UNIQUE INDEX "CleanerBlockedUsers_cleaner_id_user_id_key" ON "public"."CleanerBlockedUsers"("cleaner_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."UserBlockedCleaners" ADD CONSTRAINT "UserBlockedCleaners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBlockedCleaners" ADD CONSTRAINT "UserBlockedCleaners_cleaner_id_fkey" FOREIGN KEY ("cleaner_id") REFERENCES "public"."Cleaner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CleanerBlockedUsers" ADD CONSTRAINT "CleanerBlockedUsers_cleaner_id_fkey" FOREIGN KEY ("cleaner_id") REFERENCES "public"."Cleaner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CleanerBlockedUsers" ADD CONSTRAINT "CleanerBlockedUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
