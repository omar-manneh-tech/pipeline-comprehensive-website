/**
 * Page Content Reorder API
 * Updates the order of multiple page content sections
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const { items } = reorderSchema.parse(body);

    // Get existing content to log before state
    const existingItems = await prisma.pageContent.findMany({
      where: {
        id: { in: items.map((item) => item.id) },
      },
    });

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.pageContent.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "reorder",
        resource: "PageContent",
        before: JSON.stringify(existingItems.map((i) => ({ id: i.id, order: i.order }))),
        after: JSON.stringify(items),
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Page content order updated successfully",
    });
  } catch (error) {
    console.error("[Page Content Reorder Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to reorder page content" },
      { status: 500 }
    );
  }
}

