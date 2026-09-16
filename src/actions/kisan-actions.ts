"use server";

import { auth } from "@/auth";
import { createBookingCode } from "@/lib/identifiers";
import { calculateProcessingMinutes, cropMaster, isValidLocation, locationHierarchy } from "@/lib/procurement-master-data";
import prisma from "@/lib/prisma";
import { bookingSchema, type BookingInput } from "@/lib/validation";
import { type ActionResult, validationError } from "./types";

async function requireKisan() {
  const session = await auth();
  if (!session?.user || session.user.role !== "KISAN")
    throw new Error("UNAUTHORIZED");
  return session.user.id;
}

export async function getKisanDashboard() {
  const kisanId = await requireKisan();
  return prisma.kisan.findUniqueOrThrow({
    where: { id: kisanId },
    select: {
      name: true,
      kisanId: true,
      phoneNumber: true,
      state: true,
      district: true,
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          bookingCode: true,
          expectedQuantity: true,
          queuePosition: true,
          bookingStatus: true,
          procurementStatus: true,
          createdAt: true,
          crop: { select: { name: true } },
          centre: { select: { name: true } },
          slot: { select: { startsAt: true, endsAt: true } },
          payment: { select: { amount: true, status: true } },
          procurement: { select: { actualWeight: true, grade: true, amount: true } },
        },
      },
      notifications: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function getKisanBookingOptions() {
  await requireKisan();
  for (const name of cropMaster) {
    await prisma.crop.upsert({
      where: { name },
      update: { unit: "quintal" },
      create: { name, unit: "quintal" },
    });
  }
  return prisma.centre.findMany({
    where: { status: { not: "CLOSED" } },
    include: {
      slots: {
        where: { status: { in: ["AVAILABLE", "LIMITED"] } },
        orderBy: { startsAt: "asc" },
      },
    },
    orderBy: { name: "asc" },
  }).then(async (centres) => ({
    centres,
    crops: await prisma.crop.findMany({ orderBy: { name: "asc" } }),
    locations: locationHierarchy,
  }));
}

export async function createBooking(
  input: BookingInput,
): Promise<ActionResult<{ bookingCode: string }>> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success)
    return validationError<{ bookingCode: string }>(parsed.error);
  const kisanId = await requireKisan();
  const { centreId, slotId, state, district, tehsil, village, crops } = parsed.data;
  if (!isValidLocation(state, district, tehsil, village)) {
    return { success: false, error: "Please choose a valid State, District, Tehsil and Village combination." };
  }
  const totalQuantity = crops.reduce((total, crop) => total + crop.quantity, 0);
  const processingMinutes = calculateProcessingMinutes(totalQuantity);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.procurementSlot.findUnique({
        where: { id: slotId },
        select: { centreId: true, status: true, capacity: true, bookedCount: true, startsAt: true, endsAt: true },
      });
      if (
        !slot ||
        slot.centreId !== centreId ||
        !["AVAILABLE", "LIMITED"].includes(slot.status) ||
        slot.bookedCount >= slot.capacity
      ) throw new Error("SLOT_UNAVAILABLE");
      const existingBookings = await tx.booking.findMany({
        where: {
          slotId,
          bookingStatus: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
        select: { processingMinutes: true },
      });
      const usedProcessingMinutes = existingBookings.reduce(
        (total, booking) => total + booking.processingMinutes,
        0,
      );
      const requestedEndsAt = new Date(slot.startsAt.getTime() + (usedProcessingMinutes + processingMinutes) * 60_000);
      if (requestedEndsAt > slot.endsAt) throw new Error("SLOT_DURATION_CONFLICT");
      const changed = await tx.procurementSlot.updateMany({
        where: {
          id: slotId,
          centreId,
          status: { in: ["AVAILABLE", "LIMITED"] },
          bookedCount: slot.bookedCount,
        },
        data: { bookedCount: { increment: 1 } },
      });
      if (changed.count !== 1) throw new Error("SLOT_UNAVAILABLE");
      const cropIds = crops.map((crop) => crop.cropId);
      const validCropCount = await tx.crop.count({ where: { id: { in: cropIds } } });
      if (validCropCount !== cropIds.length) throw new Error("INVALID_CROP");
      const primaryCrop = crops[0];
      const booking = await tx.booking.create({
        data: {
          bookingCode: createBookingCode(),
          kisanId,
          centreId,
          slotId,
          cropId: primaryCrop.cropId,
          state,
          district,
          tehsil,
          village,
          expectedQuantity: totalQuantity,
          totalQuantity,
          processingMinutes,
          queuePosition: existingBookings.length + 1,
          bookingStatus: "CONFIRMED",
          procurementStatus: "SLOT_CONFIRMED",
          cropItems: {
            create: crops.map((crop) => ({
              cropId: crop.cropId,
              quantity: crop.quantity,
            })),
          },
        },
      });
      await tx.notification.create({
        data: {
          kisanId,
          type: "SUCCESS",
          title: "Procurement slot confirmed",
          message: `Your booking ${booking.bookingCode} has been confirmed. Estimated processing time is ${processingMinutes} minutes.`,
        },
      });
      return booking;
    });
    return { success: true, data: { bookingCode: result.bookingCode } };
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_UNAVAILABLE")
      return {
        success: false,
        error: "This slot is no longer available. Please choose another slot.",
      };
    if (error instanceof Error && error.message === "SLOT_DURATION_CONFLICT")
      return {
        success: false,
        error: "This slot is too short for your crop quantity. Please choose another available time.",
      };
    if (error instanceof Error && error.message === "INVALID_CROP")
      return { success: false, error: "One or more selected crops are invalid." };
    console.error("createBooking", error);
    return {
      success: false,
      error: "We could not create the booking. Please try again.",
    };
  }
}

export async function markNotificationRead(
  notificationId: string,
): Promise<ActionResult> {
  const kisanId = await requireKisan();
  const item = await prisma.notification.updateMany({
    where: { id: notificationId, kisanId },
    data: { readAt: new Date() },
  });
  return item.count
    ? { success: true, data: undefined }
    : { success: false, error: "Notification not found." };
}
