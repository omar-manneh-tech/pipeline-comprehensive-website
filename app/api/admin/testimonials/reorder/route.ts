/**
 * Testimonials Reorder API
 * Updates the order of multiple testimonials
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

    const existingItems = await prisma.testimonial.findMany({
      where: { id: { in: items.map((i) => i.id) } },
    });

    await prisma.$transaction(
      items.map((item) =>
        prisma.testimonial.update({
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
        resource: "Testimonial",
        before: existingItems.map((i) => ({ id: i.id, order: i.order })) as unknown as Record<string, unknown>,
        after: items as unknown as Record<string, unknown>,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Testimonials order updated successfully",
    });
  } catch (error) {
    console.error("[Testimonials Reorder Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to reorder testimonials" },
      { status: 500 }
    );
  }
}

