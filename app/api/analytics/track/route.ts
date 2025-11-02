/**
 * Analytics Tracking API
 * POST /api/analytics/track
 * 
 * Tracks user activities on the website
 * This endpoint accepts activity data from the frontend and stores it
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackActivity, getClientInfo, type ActivityAction } from "@/lib/analytics/tracker";
import { rateLimit, getClientIdentifier } from "@/lib/security/rateLimit";

// Validation schema for activity tracking
const trackActivitySchema = z.object({
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
  ]),
  path: z.string().min(1).max(500),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

type TrackActivityInput = z.infer<typeof trackActivitySchema>;

// Rate limiting for tracking endpoint (allow more requests since tracking is lightweight)
const trackingRateLimit = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 tracking requests per minute
  message: "Too many tracking requests. Please slow down.",
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, trackingRateLimit);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: trackingRateLimit.message,
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
    const validationResult = trackActivitySchema.safeParse(body);

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

    const data: TrackActivityInput = validationResult.data;

    // Get client information from request headers
    const clientInfo = getClientInfo(request);

    // Track the activity (non-blocking)
    trackActivity({
      action: data.action as ActivityAction,
      path: data.path,
      sessionId: data.sessionId,
      userId: data.userId,
      referrer: clientInfo.referrer || undefined,
      userAgent: clientInfo.userAgent,
      ipAddress: clientInfo.ipAddress !== "unknown" ? clientInfo.ipAddress : undefined,
      metadata: data.metadata,
    }).catch((error) => {
      // Log error but don't fail the request
      console.error("[Track Activity Error]", error);
    });

    // Return success immediately (fire and forget)
    return NextResponse.json(
      {
        success: true,
        message: "Activity tracked successfully",
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
    // Secure error handling
    console.error("[Analytics Track Error]", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to track activity. Please try again later.",
      },
      { status: 500 }
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

