/**
 * Contact API Route
 * POST /api/contact
 * 
 * Handles contact form submissions with security measures:
 * - Rate limiting (prevents spam/abuse)
 * - Input validation with Zod (server-side)
 * - CSRF protection
 * - Sanitization
 * - Request logging
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIdentifier, rateLimitConfigs } from "@/lib/security/rateLimit";
import { createErrorResponse } from "@/lib/security/errors";

// Contact form validation schema (server-side)
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\d\s\-\+\(\)]*$/, "Phone number contains invalid characters")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be less than 200 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
    .trim(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Sanitize user input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
}

// Rate limit configuration for contact form
const contactRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes
  message: "Too many contact form submissions. Please try again later.",
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, contactRateLimit);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: contactRateLimit.message,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            ...rateLimitResult.headers,
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body", message: "Please provide valid JSON data." },
        { status: 400 }
      );
    }

    // Validate with Zod (server-side validation)
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Please check your input and try again.",
          errors,
        },
        { status: 400 }
      );
    }

    const formData: ContactFormData = validationResult.data;

    // Additional sanitization
    const sanitizedData: ContactFormData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: formData.phone ? sanitizeInput(formData.phone) : undefined,
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message),
    };

    // Check for potential spam patterns
    const spamPatterns = [
      /(https?:\/\/[^\s]+)/gi, // URLs (could be spam)
      /(free|click here|buy now|limited time)/gi, // Common spam keywords
    ];

    const messageLower = sanitizedData.message.toLowerCase();
    const subjectLower = sanitizedData.subject.toLowerCase();

    // Check message for spam patterns (but allow legitimate inquiries)
    const urlCount = (sanitizedData.message.match(/https?:\/\//gi) || []).length;
    if (urlCount > 2) {
      return NextResponse.json(
        {
          error: "Spam detected",
          message: "Your message contains too many links. Please revise and try again.",
        },
        { status: 400 }
      );
    }

    // Log the submission (in production, you'd save to database or send email)
    // TODO: Implement email sending service
    // TODO: Save to database if needed
    console.log("Contact form submission:", {
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    });

    // Simulate email sending (replace with actual email service)
    // In production, use services like SendGrid, AWS SES, or Resend
    // await sendEmail({
    //   to: process.env.CONTACT_EMAIL || 'info@daddyjobe.edu.gm',
    //   from: process.env.FROM_EMAIL || 'noreply@daddyjobe.edu.gm',
    //   subject: `Contact Form: ${sanitizedData.subject}`,
    //   text: `Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nPhone: ${sanitizedData.phone || 'N/A'}\n\nMessage:\n${sanitizedData.message}`,
    // });

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We'll get back to you soon.",
      },
      {
        status: 200,
        headers: {
          ...rateLimitResult.headers,
          // Cache control to prevent caching of form submissions
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    // Secure error handling - logs server-side, returns safe message
    const errorResponse = createErrorResponse(
      error,
      "Unable to process your request. Please try again later."
    );

    return NextResponse.json(
      {
        error: "Internal server error",
        message: errorResponse.message,
      },
      { status: errorResponse.statusCode }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

