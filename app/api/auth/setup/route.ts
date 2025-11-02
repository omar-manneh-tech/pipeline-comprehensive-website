/**
 * Admin Setup API Endpoint
 * POST /api/auth/setup
 * 
 * Creates the first admin user (one-time setup)
 * This endpoint should be disabled after initial setup in production
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { hashPassword } from "@/lib/auth/password";
import { rateLimit, getClientIdentifier } from "@/lib/security/rateLimit";
import { createErrorResponse } from "@/lib/security/errors";

// Setup validation schema
const setupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

// Rate limiting for setup endpoint
const setupRateLimit = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1, // Only 1 setup attempt per hour
  message: "Setup already completed. Please use login instead.",
};

export async function POST(request: NextRequest) {
  try {
    // Check if any admin already exists
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return NextResponse.json(
        {
          error: "Setup already completed",
          message: "Admin account already exists. Please use the login endpoint.",
        },
        { status: 403 }
      );
    }

    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, setupRateLimit);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: setupRateLimit.message,
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

    // Validate with Zod
    const validationResult = setupSchema.safeParse(body);
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

    const { email, password, name } = validationResult.data;

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          error: "Email already exists",
          message: "An admin with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: "super_admin", // First admin is super_admin
      },
    });

    // Success response (don't return password hash)
    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully. Please use the login endpoint to sign in.",
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      {
        status: 201,
        headers: {
          ...rateLimitResult.headers,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    const errorResponse = createErrorResponse(
      error,
      "Unable to process setup request. Please try again later."
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

