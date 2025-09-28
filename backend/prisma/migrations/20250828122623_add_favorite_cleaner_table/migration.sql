-- CreateTable
CREATE TABLE "public"."FavoriteCleaner" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cleaner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteCleaner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteCleaner_user_id_cleaner_id_key" ON "public"."FavoriteCleaner"("user_id", "cleaner_id");

-- AddForeignKey
ALTER TABLE "public"."FavoriteCleaner" ADD CONSTRAINT "FavoriteCleaner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteCleaner" ADD CONSTRAINT "FavoriteCleaner_cleaner_id_fkey" FOREIGN KEY ("cleaner_id") REFERENCES "public"."Cleaner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
