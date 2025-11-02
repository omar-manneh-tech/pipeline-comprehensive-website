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
    const queryParams: Record<string, unknown> = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "50",
    };
    
    // Only add optional parameters if they exist and are not empty
    // searchParams.get() returns null if not found, but Zod expects undefined for optional fields
    const action = searchParams.get("action");
    if (action && action.trim().length > 0) {
      queryParams.action = action;
    }
    
    const path = searchParams.get("path");
    if (path && path.trim().length > 0) {
      queryParams.path = path;
    }
    
    const startDate = searchParams.get("startDate");
    if (startDate && startDate.trim().length > 0) {
      queryParams.startDate = startDate;
    }
    
    const endDate = searchParams.get("endDate");
    if (endDate && endDate.trim().length > 0) {
      queryParams.endDate = endDate;
    }
    
    const sessionId = searchParams.get("sessionId");
    if (sessionId && sessionId.trim().length > 0) {
      queryParams.sessionId = sessionId;
    }

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

      // Only add filters if they are provided
      if (query.action) {
        where.action = query.action;
      }

      if (query.path && query.path.length > 0) {
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

      if (query.sessionId && query.sessionId.length > 0) {
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

