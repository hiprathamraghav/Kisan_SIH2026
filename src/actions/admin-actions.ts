"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { paymentStatusSchema, procurementSchema } from "@/lib/validation";
import { type ActionResult, validationError } from "./types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("UNAUTHORIZED");
  return session.user.id;
}

export async function getOperatorDashboard() {
  const adminId = await requireAdmin();
  const admin = await prisma.admin.findUniqueOrThrow({
    where: { id: adminId },
    select: { centreId: true },
  });
  if (!admin.centreId) return { centre: null, bookings: [], slots: [] };
  const centre = await prisma.centre.findUniqueOrThrow({
    where: { id: admin.centreId },
    include: {
      slots: { orderBy: { startsAt: "asc" } },
    },
  });
  const bookings = await prisma.booking.findMany({
    where: { centreId: admin.centreId },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      bookingCode: true,
      expectedQuantity: true,
      totalQuantity: true,
      processingMinutes: true,
      state: true,
      district: true,
      tehsil: true,
      village: true,
      queuePosition: true,
      bookingStatus: true,
      procurementStatus: true,
      createdAt: true,
      crop: { select: { name: true } },
      cropItems: { select: { quantity: true, crop: { select: { name: true } } } },
      centre: { select: { name: true } },
      slot: { select: { startsAt: true, endsAt: true } },
      payment: { select: { amount: true, status: true } },
      procurement: { select: { actualWeight: true, grade: true, amount: true } },
      kisan: { select: { name: true, phoneNumber: true, kisanId: true, state: true, district: true } },
    },
  });
  return { centre, bookings, slots: centre.slots };
}

export async function updateCentreStatus(
  centreId: string,
  status: "OPEN" | "DELAYED" | "CLOSED",
): Promise<ActionResult> {
  await requireAdmin();
  await prisma.centre.update({ where: { id: centreId }, data: { status } });
  return { success: true, data: undefined };
}

export async function updateSlotStatus(
  slotId: string,
  status: "AVAILABLE" | "LIMITED" | "FULL" | "CLOSED",
): Promise<ActionResult> {
  await requireAdmin();
  await prisma.procurementSlot.update({ where: { id: slotId }, data: { status } });
  return { success: true, data: undefined };
}

export async function sendCentreNotification(
  title: string,
  message: string,
): Promise<ActionResult<{ recipients: number }>> {
  const adminId = await requireAdmin();
  const admin = await prisma.admin.findUniqueOrThrow({ where: { id: adminId }, select: { centreId: true } });
  if (!admin.centreId) return { success: false, error: "Your account is not assigned to a centre." };
  const recipients = await prisma.booking.findMany({ where: { centreId: admin.centreId }, select: { kisanId: true }, distinct: ["kisanId"] });
  if (recipients.length) await prisma.notification.createMany({ data: recipients.map(({ kisanId }) => ({ kisanId, type: "INFO" as const, title, message })) });
  return { success: true, data: { recipients: recipients.length } };
}

export async function checkInBooking(bookingId: string): Promise<ActionResult> {
  await requireAdmin();
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { bookingStatus: "CHECKED_IN", procurementStatus: "ARRIVED" },
    select: { kisanId: true, bookingCode: true },
  });
  await prisma.notification.create({
    data: {
      kisanId: booking.kisanId,
      type: "SUCCESS",
      title: "Check-in complete",
      message: `You have checked in for booking ${booking.bookingCode}.`,
    },
  });
  return { success: true, data: undefined };
}

export async function callNextFarmer(
  centreId: string,
): Promise<ActionResult<{ bookingId: string; bookingCode: string }>> {
  await requireAdmin();
  const booking = await prisma.$transaction(async (tx) => {
    const next = await tx.booking.findFirst({
      where: { centreId, bookingStatus: "CHECKED_IN" },
      orderBy: [{ queuePosition: "asc" }, { createdAt: "asc" }],
    });
    if (!next) return null;
    return tx.booking.update({
      where: { id: next.id },
      data: {
        bookingStatus: "CALLED",
        procurementStatus: "WEIGHING",
        queuePosition: 0,
      },
      select: { id: true, bookingCode: true, kisanId: true },
    });
  });
  if (!booking)
    return { success: false, error: "No checked-in farmer is waiting." };
  await prisma.notification.create({
    data: {
      kisanId: booking.kisanId,
      type: "INFO",
      title: "It is your turn",
      message: "Please proceed to the procurement counter.",
    },
  });
  return {
    success: true,
    data: { bookingId: booking.id, bookingCode: booking.bookingCode },
  };
}

export async function completeProcurement(
  input: unknown,
): Promise<ActionResult<{ amount: number }>> {
  const parsed = procurementSchema.safeParse(input);
  if (!parsed.success) return validationError<{ amount: number }>(parsed.error);
  const adminId = await requireAdmin();
  const { bookingId, actualWeight, grade, ratePerQuintal, remarks } =
    parsed.data;
  const amount = actualWeight * ratePerQuintal;
  const booking = await prisma.$transaction(async (tx) => {
    const value = await tx.booking.update({
      where: { id: bookingId },
      data: { bookingStatus: "COMPLETED", procurementStatus: "COMPLETED" },
      select: { kisanId: true },
    });
    await tx.procurement.upsert({
      where: { bookingId },
      update: {
        actualWeight,
        grade,
        ratePerQuintal,
        amount,
        remarks,
        processedById: adminId,
      },
      create: {
        bookingId,
        actualWeight,
        grade,
        ratePerQuintal,
        amount,
        remarks,
        processedById: adminId,
      },
    });
    await tx.payment.upsert({
      where: { bookingId },
      update: { amount, status: "PROCESSING", processedById: adminId },
      create: {
        bookingId,
        amount,
        status: "PROCESSING",
        processedById: adminId,
      },
    });
    return value;
  });
  await prisma.notification.create({
    data: {
      kisanId: booking.kisanId,
      type: "SUCCESS",
      title: "Procurement completed",
      message: `Your produce has been accepted. Payment of Rs. ${amount.toLocaleString("en-IN")} is being processed.`,
    },
  });
  return { success: true, data: { amount } };
}

export async function updatePaymentStatus(
  bookingId: string,
  status: unknown,
  transactionId?: string,
): Promise<ActionResult> {
  const parsed = paymentStatusSchema.safeParse(status);
  if (!parsed.success) return validationError(parsed.error);
  const adminId = await requireAdmin();
  const payment = await prisma.payment.update({
    where: { bookingId },
    data: {
      status: parsed.data,
      processedById: adminId,
      transactionId,
      paidAt: parsed.data === "RECEIVED" ? new Date() : undefined,
    },
    include: { booking: { select: { kisanId: true } } },
  });
  await prisma.notification.create({
    data: {
      kisanId: payment.booking.kisanId,
      type: parsed.data === "RECEIVED" ? "PAYMENT" : "WARNING",
      title: parsed.data === "RECEIVED" ? "Payment credited" : "Payment update",
      message:
        parsed.data === "RECEIVED"
          ? `Your payment${transactionId ? ` (${transactionId})` : ""} has been credited.`
          : "Your payment is being processed.",
    },
  });
  return { success: true, data: undefined };
}
