import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";

/** A readable ID with 48 bits of cryptographic randomness; collisions are retried before insert. */
export async function createKisanId(): Promise<string> {
  const year = new Date().getUTCFullYear();
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = randomBytes(6).toString("hex").toUpperCase();
    const kisanId = `KSN-${year}-${suffix}`;
    if (
      !(await prisma.kisan.findUnique({
        where: { kisanId },
        select: { id: true },
      }))
    )
      return kisanId;
  }
  throw new Error("Unable to allocate a Kisan ID. Please try again.");
}

export function createBookingCode(): string {
  return `PROC-${new Date().getUTCFullYear()}-${randomBytes(5).toString("hex").toUpperCase()}`;
}
