/**
 * Footer Section API - Individual Section
 * GET, PUT, DELETE operations for a single footer section
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

/**
 * GET /api/admin/footer/sections/[id]
 * Get a single footer section with links
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const section = await prisma.footerSection.findUnique({
      where: { id },
      include: {
        links: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Footer section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("[Footer API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer section" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/footer/sections/[id]
 * Delete a footer section (cascades to links)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;

    const section = await prisma.footerSection.findUnique({
      where: { id },
      include: {
        links: true,
      },
    });

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Footer section not found" },
        { status: 404 }
      );
    }

    await prisma.footerSection.delete({
      where: { id },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "delete",
        resource: "FooterSection",
        resourceId: id,
        before: section,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Footer section deleted successfully",
    });
  } catch (error) {
    console.error("[Footer API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete footer section" },
      { status: 500 }
    );
  }
}

