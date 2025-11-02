/**
 * Reset Rate Limit API Endpoint (Development Only)
 * POST /api/auth/reset-rate-limit
 * 
 * Clears all rate limits for the login endpoint
 * ONLY AVAILABLE IN DEVELOPMENT MODE
 */

import { NextRequest, NextResponse } from "next/server";
import { clearAllRateLimits } from "@/lib/security/rateLimit";

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "This endpoint is only available in development mode.",
      },
      { status: 403 }
    );
  }

  try {
    clearAllRateLimits();
    
    return NextResponse.json(
      {
        success: true,
        message: "All rate limits have been cleared.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Reset Rate Limit Error]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to reset rate limits.",
      },
      { status: 500 }
    );
  }
}

