/**
 * Admin Activities Export API (CSV)
 * GET /api/admin/activities/export/csv
 * 
 * Exports user activities as CSV file for admin team
 * Requires authentication (to be implemented)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { rateLimit, getClientIdentifier } from "@/lib/security/rateLimit";

// Query parameter validation
const querySchema = z.object({
  action: z
    .enum([
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
    ])
    .optional(),
  path: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sessionId: z.string().optional(),
  limit: z.coerce.number().int().positive().max(10000).default(10000), // Max 10k records
});

// Rate limiting for export endpoint
const exportRateLimit = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 exports per minute
  message: "Too many export requests. Please slow down.",
};

/**
 * Convert activities to CSV format
 */
function convertToCSV(activities: unknown[]): string {
  if (!activities || activities.length === 0) {
    return "id,timestamp,action,path,sessionId,userId,referrer,ipAddress,metadata\n";
  }

  // CSV header
  const headers = [
    "id",
    "timestamp",
    "action",
    "path",
    "sessionId",
    "userId",
    "referrer",
    "ipAddress",
    "userAgent",
    "metadata",
  ];

  // CSV rows
  const rows = activities.map((activity: any) => {
    const row = [
      activity.id || "",
      activity.timestamp ? new Date(activity.timestamp).toISOString() : "",
      activity.action || "",
      activity.path || "",
      activity.sessionId || "",
      activity.userId || "",
      activity.referrer || "",
      activity.ipAddress || "",
      activity.userAgent || "",
      activity.metadata ? JSON.stringify(activity.metadata) : "",
    ];

    // Escape commas and quotes in CSV
    return row
      .map((cell) => {
        const cellStr = String(cell);
        if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      })
      .join(",");
  });

  // Combine header and rows
  return [headers.join(","), ...rows].join("\n");
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // const isAuthenticated = await checkAdminAuth(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, exportRateLimit);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: exportRateLimit.message,
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
      action: searchParams.get("action"),
      path: searchParams.get("path"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      sessionId: searchParams.get("sessionId"),
      limit: searchParams.get("limit"),
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
        const activities = await prisma.userActivity.findMany({
          where,
          take: query.limit,
          orderBy: { timestamp: "desc" },
        });

        // Convert to CSV
        const csv = convertToCSV(activities);

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `user-activities-export-${timestamp}.csv`;

        // Return CSV file
        return new NextResponse(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store, no-cache, must-revalidate",
            ...rateLimitResult.headers,
          },
        });
      } else {
        // Database not configured - return empty CSV
        const csv = convertToCSV([]);
        return new NextResponse(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="user-activities-export-empty.csv"`,
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        });
      }
    } catch (dbError) {
      console.error("[Admin Activities Export DB Error]", dbError);
      return NextResponse.json(
        {
          error: "Database error",
          message: "Unable to export activities. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Admin Activities Export Error]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to export activities. Please try again later.",
      },
      { status: 500 }
    );
  }
}

