/**
 * Site Settings API
 * CRUD operations for global site settings
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(["text", "number", "boolean", "json", "url", "email", "image"]),
  category: z.enum(["general", "contact", "social", "links", "theme"]).default("general"),
  description: z.string().optional(),
});

const updateSettingSchema = z.object({
  value: z.string().optional(),
  type: z.enum(["text", "number", "boolean", "json", "url", "email", "image"]).optional(),
  category: z.enum(["general", "contact", "social", "links", "theme"]).optional(),
  description: z.string().optional(),
});

/**
 * GET /api/admin/settings
 * List all site settings with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const key = searchParams.get("key");

    const where: any = {};
    if (category) where.category = category;
    if (key) where.key = key;

    const settings = await prisma.siteSetting.findMany({
      where,
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("[Site Settings API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings
 * Create new site setting
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = settingSchema.parse(body);

    // Check if setting already exists
    const existing = await prisma.siteSetting.findUnique({
      where: { key: validatedData.key },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Site setting already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    const setting = await prisma.siteSetting.create({
      data: {
        ...validatedData,
        updatedBy: user.userId,
      },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "create",
        resource: "SiteSetting",
        resourceId: setting.id,
        after: setting,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: setting,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Site Settings API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create site setting" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Update site setting(s)
 */
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      // Update single setting by key
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
    } else {
      // Bulk update multiple settings
      const body = await request.json();
      if (!Array.isArray(body)) {
        return NextResponse.json(
          { success: false, error: "Expected array of settings" },
          { status: 400 }
        );
      }

      const updates = await Promise.all(
        body.map(async (item: { key: string; value: string }) => {
          const existing = await prisma.siteSetting.findUnique({
            where: { key: item.key },
          });

          if (existing) {
            return prisma.siteSetting.update({
              where: { key: item.key },
              data: {
                value: item.value,
                updatedBy: user.userId,
              },
            });
          } else {
            // Create if doesn't exist
            return prisma.siteSetting.create({
              data: {
                key: item.key,
                value: item.value,
                type: "text",
                category: "general",
                updatedBy: user.userId,
              },
            });
          }
        })
      );

      // Audit log
      await createAuditLog(
        {
          adminId: user.userId,
          action: "bulk_update",
          resource: "SiteSetting",
          before: JSON.stringify(body.map((item: any) => ({ key: item.key, value: "previous" }))),
          after: JSON.stringify(updates),
          ipAddress: getClientIp(request),
          userAgent: getUserAgent(request),
        },
        request
      );

      return NextResponse.json({
        success: true,
        data: updates,
      });
    }
  } catch (error) {
    console.error("[Site Settings API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}

