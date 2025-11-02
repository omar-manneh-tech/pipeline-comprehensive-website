/**
 * Validation Schemas
 * Zod schemas for input validation across the application
 */

import { z } from "zod";

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s()-]{7,20}$/.test(val),
      "Invalid phone number format"
    ),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * License Unlock Schema
 */
export const licenseUnlockSchema = z.object({
  unlockCode: z
    .string()
    .min(10, "Unlock code must be at least 10 characters")
    .max(100, "Unlock code must be less than 100 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Unlock code contains invalid characters"),
});

export type LicenseUnlockInput = z.infer<typeof licenseUnlockSchema>;

/**
 * API Request Validation Helper
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

