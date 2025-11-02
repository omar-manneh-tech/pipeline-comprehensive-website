/**
 * Admin Activities API
 * GET /api/admin/activities
 * 
 * Retrieves user activities for admin dashboard
 * Requires authentication (to be implemented)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { rateLimit, getClientIdentifier } from "@/lib/security/rateLimit";
import { requireAdmin } from "@/lib/auth/middleware";

// Query parameter validation
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  action: z.enum([
    "page_view",
    "click",
    "form_submit",
    "download",
    "link_click",
    "button_click",
    "search",
    "scroll",
    "time_on_page",
    "error",
  ]).optional(),
  path: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sessionId: z.string().optional(),
});

// Rate limiting for admin endpoints
const adminRateLimit = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  message: "Too many requests. Please slow down.",
};

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    try {
      requireAdmin(request);
    } catch (authError) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required. Please log in to access admin features.",
        },
        { status: 401 }
      );
    }

    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, adminRateLimit);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: adminRateLimit.message,
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      action: searchParams.get("action"),
      path: searchParams.get("path"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      sessionId: searchParams.get("sessionId"),
    };

    const validationResult = querySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Invalid query parameters.",
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const query = validationResult.data;
    const skip = (query.page - 1) * query.limit;

    try {
      // Build where clause
      const where: {
        action?: string;
        path?: { contains: string };
        timestamp?: { gte?: Date; lte?: Date };
        sessionId?: string;
      } = {};

      if (query.action) {
        where.action = query.action;
      }

      if (query.path) {
        where.path = { contains: query.path };
      }

      if (query.startDate || query.endDate) {
        where.timestamp = {};
        if (query.startDate) {
          where.timestamp.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          where.timestamp.lte = new Date(query.endDate);
        }
      }

      if (query.sessionId) {
        where.sessionId = query.sessionId;
      }

      // Query database
      if (prisma && typeof prisma.userActivity?.findMany === "function") {
        const [activities, total] = await Promise.all([
          prisma.userActivity.findMany({
            where,
            skip,
            take: query.limit,
            orderBy: { timestamp: "desc" },
          }),
          prisma.userActivity.count({ where }),
        ]);

        return NextResponse.json(
          {
            success: true,
            data: activities,
            pagination: {
              page: query.page,
              limit: query.limit,
              total,
              totalPages: Math.ceil(total / query.limit),
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
      } else {
        // Database not configured - return mock data
        return NextResponse.json(
          {
            success: true,
            data: [],
            pagination: {
              page: query.page,
              limit: query.limit,
              total: 0,
              totalPages: 0,
            },
            message: "Database not configured. Please set up Prisma to view activities.",
          },
          { status: 200 }
        );
      }
    } catch (dbError) {
      console.error("[Admin Activities DB Error]", dbError);
      return NextResponse.json(
        {
          error: "Database error",
          message: "Unable to fetch activities. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Admin Activities Error]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to fetch activities. Please try again later.",
      },
      { status: 500 }
    );
  }
}

