/**
 * Public Statistics API
 * Returns visible statistics for frontend
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * GET /api/site/statistics
 * Get visible statistics
 */
export async function GET(request: NextRequest) {
  try {
    const statistics = await prisma.statistic.findMany({
      where: {
        visible: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error("[Statistics API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

