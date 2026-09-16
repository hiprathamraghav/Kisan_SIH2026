import { z } from "zod";

const indianPhone = /^[6-9]\d{9}$/;

export const kisanSignupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phoneNumber: z
    .string()
    .trim()
    .regex(indianPhone, "Enter a valid 10-digit Indian mobile number"),
  state: z.string().trim().min(2, "Select your state").max(80),
  district: z.string().trim().min(2, "Enter your district").max(80),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100),
});

export const kisanLoginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your phone number or Kisan ID"),
  password: z.string().min(1, "Password is required").max(100),
});

export const adminLoginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your phone number or Admin ID"),
  password: z.string().min(1, "Password is required").max(100),
});

export const bookingCropSchema = z.object({
  cropId: z.string().cuid(),
  quantity: z.coerce
    .number()
    .positive("Quantity must be greater than zero")
    .max(1000),
});

export const bookingSchema = z.object({
  centreId: z.string().min(1, "Select a procurement centre"),
  slotId: z.string().min(1, "Select a procurement slot"),
  state: z.string().trim().min(1, "Select a state"),
  district: z.string().trim().min(1, "Select a district"),
  tehsil: z.string().trim().min(1, "Select a tehsil"),
  village: z.string().trim().min(1, "Select a village"),
  crops: z.array(bookingCropSchema).min(1, "Select at least one crop").max(12),
}).superRefine((value, ctx) => {
  const ids = new Set<string>();
  value.crops.forEach((crop, index) => {
    if (ids.has(crop.cropId)) {
      ctx.addIssue({
        code: "custom",
        path: ["crops", index, "cropId"],
        message: "Duplicate crop selected.",
      });
    }
    ids.add(crop.cropId);
  });
});

export const bookingStatusSchema = z.enum([
  "CONFIRMED",
  "CHECKED_IN",
  "CALLED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const procurementSchema = z.object({
  bookingId: z.string().cuid(),
  actualWeight: z.coerce.number().positive().max(1000),
  grade: z.string().trim().min(1).max(30),
  ratePerQuintal: z.coerce.number().positive().max(100000),
  remarks: z.string().trim().max(500).optional(),
});

export const paymentStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "RECEIVED",
  "FAILED",
]);

export type KisanSignupInput = z.infer<typeof kisanSignupSchema>;
export type KisanLoginInput = z.infer<typeof kisanLoginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
