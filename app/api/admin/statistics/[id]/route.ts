/**
 * Statistic API - Individual Statistic
 * GET, PUT, DELETE operations for a single statistic
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const updateStatisticSchema = z.object({
  number: z.number().int().optional(),
  suffix: z.string().optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  bgColor: z.string().min(1).optional(),
  textColor: z.string().min(1).optional(),
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
});

/**
 * GET /api/admin/statistics/[id]
 * Get a single statistic
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const statistic = await prisma.statistic.findUnique({
      where: { id },
    });

    if (!statistic) {
      return NextResponse.json(
        { success: false, error: "Statistic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: statistic,
    });
  } catch (error) {
    console.error("[Statistics API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistic" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/statistics/[id]
 * Update a statistic
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateStatisticSchema.parse(body);

    const existingStatistic = await prisma.statistic.findUnique({
      where: { id },
    });

    if (!existingStatistic) {
      return NextResponse.json(
        { success: false, error: "Statistic not found" },
        { status: 404 }
      );
    }

    const statistic = await prisma.statistic.update({
      where: { id },
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
        resource: "Statistic",
        resourceId: statistic.id,
        before: existingStatistic,
        after: statistic,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: statistic,
    });
  } catch (error) {
    console.error("[Statistics API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update statistic" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/statistics/[id]
 * Delete a statistic
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;

    const statistic = await prisma.statistic.findUnique({
      where: { id },
    });

    if (!statistic) {
      return NextResponse.json(
        { success: false, error: "Statistic not found" },
        { status: 404 }
      );
    }

    await prisma.statistic.delete({
      where: { id },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "delete",
        resource: "Statistic",
        resourceId: id,
        before: statistic,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Statistic deleted successfully",
    });
  } catch (error) {
    console.error("[Statistics API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete statistic" },
      { status: 500 }
    );
  }
}

