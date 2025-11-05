/**
 * Public Footer API
 * Returns footer sections and links for frontend
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * GET /api/site/footer
 * Get visible footer sections and links
 */
export async function GET(request: NextRequest) {
  try {
    const sections = await prisma.footerSection.findMany({
      where: {
        visible: true,
      },
      include: {
        links: {
          where: {
            visible: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error("[Footer API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer data" },
      { status: 500 }
    );
  }
}

