/**
 * Admin Login API Endpoint
 * POST /api/auth/login
 * 
 * Authenticates admin users and returns JWT token
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";
import { rateLimit, getClientIdentifier } from "@/lib/security/rateLimit";
import { createErrorResponse } from "@/lib/security/errors";

// Login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Rate limiting for login endpoint (prevent brute force)
// More lenient in development for easier testing
const loginRateLimit = {
  windowMs: process.env.NODE_ENV === "development" 
    ? 5 * 60 * 1000  // 5 minutes in development
    : 15 * 60 * 1000, // 15 minutes in production
  maxRequests: process.env.NODE_ENV === "development"
    ? 20  // 20 attempts per 5 minutes in development
    : 5,   // 5 attempts per 15 minutes in production
  message: "Too many login attempts. Please try again later.",
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, loginRateLimit);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: loginRateLimit.message,
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
    const validationResult = loginSchema.safeParse(body);
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

    const { email, password } = validationResult.data;

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      // Don't reveal if email exists or not (security best practice)
      return NextResponse.json(
        {
          error: "Invalid credentials",
          message: "Email or password is incorrect.",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          message: "Email or password is incorrect.",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Update last login (optional, but useful for tracking)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { updatedAt: new Date() },
    });

    // Success response
    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      {
        status: 200,
        headers: {
          ...rateLimitResult.headers,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    const errorResponse = createErrorResponse(
      error,
      "Unable to process login request. Please try again later."
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

