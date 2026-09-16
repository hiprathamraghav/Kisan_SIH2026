import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AdminRole,
  BookingStatus,
  NotificationType,
  PaymentStatus,
  PrismaClient,
  ProcurementStatus,
  SlotStatus,
} from "../src/generated/prisma/client";
import { cropMaster } from "../src/lib/procurement-master-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("DATABASE_URL is required to seed the database.");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const passwordHash = await bcrypt.hash("Kisan@123", 12);

  const centre = await prisma.centre.upsert({
    where: { code: "UP-MRT-001" },
    update: { name: "Meerut Procurement Centre", status: "OPEN" },
    create: {
      code: "UP-MRT-001",
      name: "Meerut Procurement Centre",
      address: "Daurala Mandi, Meerut",
      district: "Meerut",
      state: "Uttar Pradesh",
    },
  });

  await Promise.all(cropMaster.map((name) => prisma.crop.upsert({
    where: { name },
    update: { unit: "quintal" },
    create: { name, unit: "quintal" },
  })));
  const wheat = await prisma.crop.findUniqueOrThrow({ where: { name: "Wheat" } });

  const kisan = await prisma.kisan.upsert({
    where: { phoneNumber: "9876543210" },
    update: {},
    create: {
      kisanId: "KSN-2026-DEMO01",
      name: "Ramesh Kumar",
      phoneNumber: "9876543210",
      state: "Uttar Pradesh",
      district: "Meerut",
      passwordHash,
    },
  });

  await prisma.admin.upsert({
    where: { adminId: "ADM-MEERUT-01" },
    update: { role: AdminRole.SUPER_ADMIN, centreId: centre.id },
    create: {
      adminId: "ADM-MEERUT-01",
      name: "Anita Sharma",
      phoneNumber: "9898989898",
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      permissions: ["CENTRE_MANAGE", "BOOKING_MANAGE", "PAYMENT_MANAGE"],
      centreId: centre.id,
    },
  });

  const startsAt = new Date("2026-09-18T04:30:00.000Z");
  const slot = await prisma.procurementSlot.upsert({
    where: { id: "seed-meerut-slot-1000" },
    update: { capacity: 25, status: SlotStatus.LIMITED },
    create: {
      id: "seed-meerut-slot-1000",
      centreId: centre.id,
      startsAt,
      endsAt: new Date("2026-09-18T05:30:00.000Z"),
      capacity: 25,
      bookedCount: 1,
      status: SlotStatus.LIMITED,
    },
  });

  const booking = await prisma.booking.upsert({
    where: { bookingCode: "PROC-2026-DEMO01" },
    update: {},
    create: {
      bookingCode: "PROC-2026-DEMO01",
      kisanId: kisan.id,
      centreId: centre.id,
      slotId: slot.id,
      cropId: wheat.id,
      expectedQuantity: 25,
      totalQuantity: 25,
      processingMinutes: 137,
      state: "Uttar Pradesh",
      district: "Meerut",
      tehsil: "Daurala",
      village: "Sardhana",
      queuePosition: 12,
      bookingStatus: BookingStatus.CONFIRMED,
      procurementStatus: ProcurementStatus.SLOT_CONFIRMED,
    },
  });

  await prisma.bookingCrop.upsert({
    where: { bookingId_cropId: { bookingId: booking.id, cropId: wheat.id } },
    update: { quantity: 25 },
    create: { bookingId: booking.id, cropId: wheat.id, quantity: 25 },
  });

  await prisma.payment.upsert({
    where: { bookingId: booking.id },
    update: { amount: 56875, status: PaymentStatus.PROCESSING },
    create: {
      bookingId: booking.id,
      amount: 56875,
      status: PaymentStatus.PROCESSING,
    },
  });

  const notificationCount = await prisma.notification.count({
    where: { kisanId: kisan.id },
  });
  if (notificationCount === 0) {
    await prisma.notification.createMany({
      data: [
        {
          kisanId: kisan.id,
          type: NotificationType.INFO,
          title: "Your procurement slot is tomorrow",
          message:
            "Your Wheat procurement slot at Meerut Centre is scheduled for 10:00 AM.",
        },
        {
          kisanId: kisan.id,
          type: NotificationType.WARNING,
          title: "Payment is being processed",
          message: "Your payment is being processed. No action is needed.",
        },
      ],
    });
  }

  console.log("Seed complete: 1 centre, 3 crops, 1 Kisan, 1 admin, 1 booking.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
