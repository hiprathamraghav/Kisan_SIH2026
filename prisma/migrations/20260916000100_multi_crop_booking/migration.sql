ALTER TABLE "Kisan" ADD COLUMN "tehsil" TEXT;
ALTER TABLE "Kisan" ADD COLUMN "village" TEXT;

ALTER TABLE "Booking" ADD COLUMN "state" TEXT;
ALTER TABLE "Booking" ADD COLUMN "district" TEXT;
ALTER TABLE "Booking" ADD COLUMN "tehsil" TEXT;
ALTER TABLE "Booking" ADD COLUMN "village" TEXT;
ALTER TABLE "Booking" ADD COLUMN "totalQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Booking" ADD COLUMN "processingMinutes" INTEGER NOT NULL DEFAULT 0;

UPDATE "Booking"
SET "totalQuantity" = "expectedQuantity"
WHERE "totalQuantity" = 0;

CREATE TABLE "BookingCrop" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingCrop_pkey" PRIMARY KEY ("id")
);

INSERT INTO "BookingCrop" ("id", "bookingId", "cropId", "quantity")
SELECT 'legacy-' || "id", "id", "cropId", "expectedQuantity"
FROM "Booking"
ON CONFLICT DO NOTHING;

CREATE UNIQUE INDEX "BookingCrop_bookingId_cropId_key" ON "BookingCrop"("bookingId", "cropId");
CREATE INDEX "BookingCrop_cropId_idx" ON "BookingCrop"("cropId");

ALTER TABLE "BookingCrop" ADD CONSTRAINT "BookingCrop_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookingCrop" ADD CONSTRAINT "BookingCrop_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
