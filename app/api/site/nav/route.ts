/**
 * Public Navigation API
 * Returns navigation structure for frontend
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * GET /api/site/nav
 * Get navigation structure for public use
 */
export async function GET(request: NextRequest) {
  try {
    // Get all visible navigation items
    const items = await prisma.navigationItem.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });

    // Build navigation structure
    const navStructure = items
      .filter((item) => !item.parentId) // Top-level items
      .map((item) => {
        const submenu = items.filter((sub) => sub.parentId === item.id);
        return {
          label: item.label,
          href: item.href,
          icon: item.icon,
          target: item.target,
          submenu: submenu.length > 0 ? submenu.map((sub) => ({
            label: sub.label,
            href: sub.href,
            target: sub.target,
          })) : undefined,
        };
      });

    return NextResponse.json({
      success: true,
      data: navStructure,
    });
  } catch (error) {
    console.error("[Public Navigation API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}

