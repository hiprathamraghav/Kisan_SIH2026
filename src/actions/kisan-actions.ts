"use server";

import { auth } from "@/auth";
import { createBookingCode } from "@/lib/identifiers";
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
        include: {
          crop: true,
          centre: true,
          slot: true,
          payment: true,
          procurement: true,
        },
      },
      notifications: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function createBooking(
  input: BookingInput,
): Promise<ActionResult<{ bookingCode: string }>> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success)
    return validationError<{ bookingCode: string }>(parsed.error);
  const kisanId = await requireKisan();
  const { centreId, slotId, cropId, expectedQuantity } = parsed.data;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const changed = await tx.procurementSlot.updateMany({
        where: {
          id: slotId,
          centreId,
          status: { in: ["AVAILABLE", "LIMITED"] },
          bookedCount: { lt: tx.procurementSlot.fields.capacity },
        },
        data: { bookedCount: { increment: 1 } },
      });
      if (changed.count !== 1) throw new Error("SLOT_UNAVAILABLE");
      const booking = await tx.booking.create({
        data: {
          bookingCode: createBookingCode(),
          kisanId,
          centreId,
          slotId,
          cropId,
          expectedQuantity,
          bookingStatus: "CONFIRMED",
          procurementStatus: "SLOT_CONFIRMED",
        },
      });
      await tx.notification.create({
        data: {
          kisanId,
          type: "SUCCESS",
          title: "Procurement slot confirmed",
          message: `Your booking ${booking.bookingCode} has been confirmed.`,
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
