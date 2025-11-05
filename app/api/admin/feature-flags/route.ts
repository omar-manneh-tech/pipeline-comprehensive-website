/**
 * Feature Flags API
 * CRUD operations for feature toggles
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const featureFlagSchema = z.object({
  key: z.string().min(1),
  enabled: z.boolean().default(true),
  description: z.string().optional(),
});

/**
 * GET /api/admin/feature-flags
 * List all feature flags
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const flags = await prisma.featureToggle.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: flags,
    });
  } catch (error) {
    console.error("[Feature Flags API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feature flags" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/feature-flags
 * Create new feature flag
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = featureFlagSchema.parse(body);

    // Check if flag already exists
    const existing = await prisma.featureToggle.findUnique({
      where: { key: validatedData.key },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Feature flag already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    const flag = await prisma.featureToggle.create({
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
        resource: "FeatureToggle",
        resourceId: flag.id,
        after: flag,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: flag,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Feature Flags API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create feature flag" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/feature-flags
 * Update feature flag
 */
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Key is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = featureFlagSchema.partial().parse(body);

    const existingFlag = await prisma.featureToggle.findUnique({
      where: { key },
    });

    if (!existingFlag) {
      return NextResponse.json(
        { success: false, error: "Feature flag not found" },
        { status: 404 }
      );
    }

    const flag = await prisma.featureToggle.update({
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
        resource: "FeatureToggle",
        resourceId: flag.id,
        before: existingFlag,
        after: flag,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: flag,
    });
  } catch (error) {
    console.error("[Feature Flags API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update feature flag" },
      { status: 500 }
    );
  }
}

