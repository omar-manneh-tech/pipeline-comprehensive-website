/**
 * Feature Check API Route
 * POST /api/v1/features/check
 * 
 * Checks if a feature is enabled for the current subscription
 * Protected with rate limiting and validation
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIdentifier, rateLimitConfigs } from "@/lib/security/rateLimit";
import { createErrorResponse } from "@/lib/security/errors";
import { Feature, SubscriptionTier, FEATURE_ACCESS } from "@/lib/features/toggles";

const featureCheckSchema = z.object({
  feature: z.nativeEnum(Feature),
});

export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validation = featureCheckSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Feature name is required and must be valid",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { feature } = validation.data;

    // Get current subscription tier
    // TODO: In production, get from database or session
    const currentTier = process.env.SUBSCRIPTION_TIER 
      ? (process.env.SUBSCRIPTION_TIER as SubscriptionTier)
      : SubscriptionTier.BASIC;

    // Check if feature is enabled for this tier
    const enabled = FEATURE_ACCESS[currentTier].includes(feature);

    return NextResponse.json(
      {
        enabled,
        feature,
        tier: currentTier,
      },
      {
        status: 200,
        headers: {
          ...rateLimitResult.headers,
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    // Secure error handling
    const errorResponse = createErrorResponse(
      error,
      "Unable to check feature status. Please try again later."
    );

    return NextResponse.json(
      {
        enabled: false,
        error: errorResponse.message,
      },
      { status: errorResponse.statusCode }
    );
  }
}

