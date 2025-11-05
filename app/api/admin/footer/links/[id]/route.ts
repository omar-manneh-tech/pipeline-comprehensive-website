/**
 * Footer Link API - Individual Link
 * GET, PUT, DELETE operations for a single footer link
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

/**
 * GET /api/admin/footer/links/[id]
 * Get a single footer link
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const link = await prisma.footerLink.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Footer link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("[Footer API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer link" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/footer/links/[id]
 * Delete a footer link
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;

    const link = await prisma.footerLink.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Footer link not found" },
        { status: 404 }
      );
    }

    await prisma.footerLink.delete({
      where: { id },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "delete",
        resource: "FooterLink",
        resourceId: id,
        before: link,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Footer link deleted successfully",
    });
  } catch (error) {
    console.error("[Footer API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete footer link" },
      { status: 500 }
    );
  }
}

