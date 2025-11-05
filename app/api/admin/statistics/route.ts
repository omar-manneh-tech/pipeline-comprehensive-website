/**
 * Statistics API
 * CRUD operations for statistics (TileGrid section)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const statisticSchema = z.object({
  number: z.number().int(),
  suffix: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1), // Icon name from lucide-react
  bgColor: z.string().min(1), // CSS color class
  textColor: z.string().min(1), // CSS color class
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

/**
 * GET /api/admin/statistics
 * List statistics
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const statistics = await prisma.statistic.findMany({
      orderBy: { order: "asc" },
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

/**
 * POST /api/admin/statistics
 * Create new statistic
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = statisticSchema.parse(body);

    const statistic = await prisma.statistic.create({
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
        resource: "Statistic",
        resourceId: statistic.id,
        after: statistic,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: statistic,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Statistics API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create statistic" },
      { status: 500 }
    );
  }
}

