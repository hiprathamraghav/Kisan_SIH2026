"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { signOut } from "@/auth";
import { createKisanId } from "@/lib/identifiers";
import prisma from "@/lib/prisma";
import { kisanSignupSchema, type KisanSignupInput } from "@/lib/validation";
import { type ActionResult, validationError } from "./types";

export async function registerKisan(
  input: KisanSignupInput,
): Promise<ActionResult<{ kisanId: string; name: string }>> {
  const parsed = kisanSignupSchema.safeParse(input);
  if (!parsed.success)
    return validationError<{ kisanId: string; name: string }>(parsed.error);
  const { name, phoneNumber, state, district, password } = parsed.data;
  const existing = await prisma.kisan.findUnique({
    where: { phoneNumber },
    select: { id: true },
  });
  if (existing)
    return {
      success: false,
      error: "An account already exists for this phone number.",
      fieldErrors: {
        phoneNumber: ["This phone number is already registered."],
      },
    };

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    // The database unique constraint remains the final protection in the unlikely event of a racing registration.
    const kisan = await prisma.kisan.create({
      data: {
        kisanId: await createKisanId(),
        name,
        phoneNumber,
        state,
        district,
        passwordHash,
      },
      select: { kisanId: true, name: true },
    });
    revalidatePath("/farmer");
    return { success: true, data: kisan };
  } catch (error) {
    if (isUniqueViolation(error))
      return {
        success: false,
        error: "An account already exists for this phone number.",
      };
    console.error("registerKisan", error);
    return {
      success: false,
      error: "We could not create your account. Please try again.",
    };
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/auth/kisan/login" });
}

function isUniqueViolation(error: unknown) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === "P2002",
  );
}
