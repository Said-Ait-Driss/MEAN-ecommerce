-- CreateTable
CREATE TABLE "public"."_BookingServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookingServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BookingServices_B_index" ON "public"."_BookingServices"("B");

-- AddForeignKey
ALTER TABLE "public"."_BookingServices" ADD CONSTRAINT "_BookingServices_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BookingServices" ADD CONSTRAINT "_BookingServices_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
