/**
 * Admin Staff API - Reorder Staff Members
 * Updates the order of multiple staff members
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";

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
    requireAdmin(request);
    const body = await request.json();
    const { items } = reorderSchema.parse(body);

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.staffMember.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Staff order updated successfully",
    });
  } catch (error) {
    console.error("[Staff Reorder Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to reorder staff members" },
      { status: 500 }
    );
  }
}

