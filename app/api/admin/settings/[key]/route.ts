/**
 * Site Setting API - Individual Setting
 * GET, PUT, DELETE operations for a single site setting
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const updateSettingSchema = z.object({
  value: z.string().optional(),
  type: z.enum(["text", "number", "boolean", "json", "url", "email", "image"]).optional(),
  category: z.enum(["general", "contact", "social", "links", "theme"]).optional(),
  description: z.string().optional(),
});

/**
 * GET /api/admin/settings/[key]
 * Get a single site setting
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    requireAdmin(request);
    const { key } = await params;

    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      return NextResponse.json(
        { success: false, error: "Site setting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error("[Site Settings API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch site setting" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings/[key]
 * Update a site setting
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { key } = await params;
    const body = await request.json();
    const validatedData = updateSettingSchema.parse(body);

    const existingSetting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!existingSetting) {
      return NextResponse.json(
        { success: false, error: "Site setting not found" },
        { status: 404 }
      );
    }

    const setting = await prisma.siteSetting.update({
      where: { key },
      data: {
        ...validatedData,
        updatedBy: user.userId,
      },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "update",
        resource: "SiteSetting",
        resourceId: setting.id,
        before: existingSetting,
        after: setting,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error("[Site Settings API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update site setting" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/settings/[key]
 * Delete a site setting
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { key } = await params;

    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      return NextResponse.json(
        { success: false, error: "Site setting not found" },
        { status: 404 }
      );
    }

    await prisma.siteSetting.delete({
      where: { key },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "delete",
        resource: "SiteSetting",
        resourceId: setting.id,
        before: setting,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Site setting deleted successfully",
    });
  } catch (error) {
    console.error("[Site Settings API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete site setting" },
      { status: 500 }
    );
  }
}

