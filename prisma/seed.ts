import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AdminRole,
  BookingStatus,
  CentreStatus,
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
    update: {
      state: "Uttar Pradesh",
      district: "Meerut",
      tehsil: "Daurala",
      village: "Sardhana",
    },
    create: {
      kisanId: "KSN-2026-DEMO01",
      name: "Ramesh Kumar",
      phoneNumber: "9876543210",
      state: "Uttar Pradesh",
      district: "Meerut",
      tehsil: "Daurala",
      village: "Sardhana",
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

  for (let index = 1; index <= 19; index += 1) {
    const day = 18 + Math.floor((index - 1) / 3);
    const hour = 6 + ((index - 1) % 3) * 2;
    await prisma.procurementSlot.upsert({
      where: { id: `seed-meerut-slot-${index}` },
      update: { status: SlotStatus.AVAILABLE, capacity: 30, bookedCount: 0 },
      create: {
        id: `seed-meerut-slot-${index}`,
        centreId: centre.id,
        startsAt: new Date(`2026-09-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:30:00.000Z`),
        endsAt: new Date(`2026-09-${String(day).padStart(2, "0")}T${String(hour + 1).padStart(2, "0")}:30:00.000Z`),
        capacity: 30,
        status: SlotStatus.AVAILABLE,
      },
    });
  }

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

  const demoSchemes = Array.from({ length: 20 }, (_, index) => ({
    slug: `demo-scheme-${index + 1}`,
    name: `Farmer Support Scheme ${index + 1}`,
    summary: `Financial and agricultural support for eligible farmers in programme region ${index + 1}.`,
    about: "This government support programme helps eligible farmers improve resilience, productivity, and access to agricultural services.",
    eligibility: "Eligibility depends on land records, crop type, location, and the active government notification.",
    benefits: ["Direct financial support", "Transparent application tracking", "Agriculture department assistance"],
    documents: ["Aadhaar card", "Bank passbook", "Land record", "Mobile number"],
    apply: "Apply through the official agriculture portal or the nearest Common Service Centre.",
    dates: "Application windows follow the current state notification.",
  }));
  for (const scheme of demoSchemes) {
    await prisma.scheme.upsert({ where: { slug: scheme.slug }, update: scheme, create: scheme });
  }

  for (let index = 1; index <= 19; index += 1) {
    const centre = await prisma.centre.upsert({
      where: { code: `DEMO-${String(index).padStart(3, "0")}` },
      update: { status: CentreStatus.OPEN },
      create: {
        code: `DEMO-${String(index).padStart(3, "0")}`,
        name: `Demo Procurement Centre ${index}`,
        address: `Main Mandi Road ${index}`,
        district: index % 2 ? "Meerut" : "Ludhiana",
        state: index % 2 ? "Uttar Pradesh" : "Punjab",
      },
    });
    const slot = await prisma.procurementSlot.upsert({
      where: { id: `demo-slot-${index}` },
      update: { status: SlotStatus.AVAILABLE, capacity: 40, bookedCount: 0 },
      create: {
        id: `demo-slot-${index}`,
        centreId: centre.id,
        startsAt: new Date(`2026-09-${String(19 + (index % 10)).padStart(2, "0")}T04:30:00.000Z`),
        endsAt: new Date(`2026-09-${String(19 + (index % 10)).padStart(2, "0")}T06:30:00.000Z`),
        capacity: 40,
        status: SlotStatus.AVAILABLE,
      },
    });
    const kisan = await prisma.kisan.upsert({
      where: { phoneNumber: `90000000${String(index).padStart(2, "0")}` },
      update: {},
      create: {
        kisanId: `KSN-2026-DEMO${String(index + 1).padStart(2, "0")}`,
        name: `Demo Farmer ${index}`,
        phoneNumber: `90000000${String(index).padStart(2, "0")}`,
        state: index % 2 ? "Uttar Pradesh" : "Punjab",
        district: index % 2 ? "Meerut" : "Ludhiana",
        tehsil: index % 2 ? "Daurala" : "Ludhiana East",
        village: index % 2 ? "Sardhana" : "Sahnewal",
        passwordHash,
      },
    });
    const crop = await prisma.crop.findUniqueOrThrow({ where: { name: cropMaster[index % cropMaster.length] } });
    const booking = await prisma.booking.upsert({
      where: { bookingCode: `PROC-2026-DEMO${String(index + 1).padStart(2, "0")}` },
      update: {},
      create: {
        bookingCode: `PROC-2026-DEMO${String(index + 1).padStart(2, "0")}`,
        kisanId: kisan.id,
        centreId: centre.id,
        slotId: slot.id,
        cropId: crop.id,
        state: kisan.state,
        district: kisan.district,
        tehsil: kisan.tehsil,
        village: kisan.village,
        expectedQuantity: 10 + index,
        totalQuantity: 10 + index,
        processingMinutes: 74 + index,
        queuePosition: index,
        bookingStatus: BookingStatus.CONFIRMED,
        procurementStatus: ProcurementStatus.SLOT_CONFIRMED,
      },
    });
    await prisma.bookingCrop.upsert({
      where: { bookingId_cropId: { bookingId: booking.id, cropId: crop.id } },
      update: { quantity: 10 + index },
      create: { bookingId: booking.id, cropId: crop.id, quantity: 10 + index },
    });
    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: { amount: (10 + index) * 2200, status: index % 3 === 0 ? PaymentStatus.RECEIVED : PaymentStatus.PROCESSING },
      create: { bookingId: booking.id, amount: (10 + index) * 2200, status: index % 3 === 0 ? PaymentStatus.RECEIVED : PaymentStatus.PROCESSING },
    });
    await prisma.notification.createMany({
      data: [
        { kisanId: kisan.id, type: NotificationType.INFO, title: "Booking confirmed", message: `Your booking ${booking.bookingCode} is confirmed.` },
        { kisanId: kisan.id, type: NotificationType.SUCCESS, title: "Centre information", message: `Please arrive at ${centre.name} before your slot.` },
      ],
      skipDuplicates: true,
    });
    await prisma.admin.upsert({
      where: { adminId: `ADM-DEMO-${String(index).padStart(2, "0")}` },
      update: { centreId: centre.id },
      create: {
        adminId: `ADM-DEMO-${String(index).padStart(2, "0")}`,
        name: `Demo Operator ${index}`,
        phoneNumber: `91000000${String(index).padStart(2, "0")}`,
        passwordHash,
        role: AdminRole.CENTRE_OPERATOR,
        permissions: ["CENTRE_MANAGE", "BOOKING_MANAGE", "PAYMENT_MANAGE"],
        centreId: centre.id,
      },
    });
  }

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

  console.log("Seed complete: presentation dataset with 20 schemes and 20 demo centres, slots, farmers, admins, bookings, payments, and notifications.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
