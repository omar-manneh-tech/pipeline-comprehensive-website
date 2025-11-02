/**
 * License Check API Route
 * GET /api/v1/license/check
 * 
 * Returns the current license status
 * Protected with rate limiting and secure error handling
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIdentifier, rateLimitConfigs } from "@/lib/security/rateLimit";
import { createErrorResponse } from "@/lib/security/errors";

// License utility functions (simplified for now)
function getLicenseExpirationDate(): Date | null {
  const pilotStartDate = process.env.LICENSE_PILOT_START_DATE 
    ? new Date(process.env.LICENSE_PILOT_START_DATE)
    : new Date();
  const expirationDate = new Date(pilotStartDate);
  expirationDate.setMonth(expirationDate.getMonth() + 1);
  return expirationDate;
}

function isLicenseExpired(): boolean {
  const expirationDate = getLicenseExpirationDate();
  if (!expirationDate) return false;
  return new Date() > expirationDate;
}

function getDaysRemaining(): number {
  const expirationDate = getLicenseExpirationDate();
  if (!expirationDate) return -1;
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, rateLimitConfigs.license);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: rateLimitConfigs.license.message,
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

    // Get license status
    const expired = isLicenseExpired();
    const daysRemaining = getDaysRemaining();
    const expirationDate = getLicenseExpirationDate();
    const unlockCode = process.env.LICENSE_UNLOCK_CODE || null;
    const hasValidUnlockCode = unlockCode ? true : false;
    const isValid = !expired || hasValidUnlockCode;

    const status = {
      valid: isValid,
      expired: expired && !isValid,
      daysRemaining,
      expirationDate: expirationDate?.toISOString() || null,
      pilotPeriod: !expired,
      unlockCode: isValid && unlockCode ? "***" : null,
    };

    const responseData = {
      status,
      message: status.expired
        ? "License has expired. Please renew to continue using all features."
        : status.pilotPeriod
        ? `Pilot period active. ${status.daysRemaining} days remaining.`
        : "License is valid.",
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        ...rateLimitResult.headers,
        // Cache control headers for API response
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    // Secure error handling - logs server-side, returns safe message
    const errorResponse = createErrorResponse(
      error,
      "Unable to check license status. Please try again later."
    );

    return NextResponse.json(
      {
        status: {
          valid: true,
          expired: false,
          daysRemaining: 0,
          expirationDate: null,
          pilotPeriod: true,
        },
        message: errorResponse.message,
      },
      { status: errorResponse.statusCode }
    );
  }
}

