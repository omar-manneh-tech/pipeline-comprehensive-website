/**
 * Public Feature Flags API
 * Returns enabled feature flags for frontend
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * GET /api/site/flags
 * Get feature flags for public use
 */
export async function GET(request: NextRequest) {
  try {
    const flags = await prisma.featureToggle.findMany({
      where: { enabled: true },
      select: { key: true, enabled: true },
    });

    // Convert to key-value object for easier lookup
    const flagsMap: Record<string, boolean> = {};
    flags.forEach((flag) => {
      flagsMap[flag.key] = flag.enabled;
    });

    return NextResponse.json({
      success: true,
      data: flagsMap,
    });
  } catch (error) {
    console.error("[Public Feature Flags API Error]", error);
    // Return default flags if database error
    return NextResponse.json({
      success: true,
      data: {},
    });
  }
}

