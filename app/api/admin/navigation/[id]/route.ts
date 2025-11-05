/**
 * Navigation Item API - Individual Item
 * GET, PUT, DELETE operations for a single navigation item
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const updateNavigationItemSchema = z.object({
  label: z.string().min(1).optional(),
  href: z.string().min(1).optional(),
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
  parentId: z.string().nullable().optional(),
  icon: z.string().optional(),
  target: z.enum(["_self", "_blank"]).optional(),
});

/**
 * GET /api/admin/navigation/[id]
 * Get a single navigation item
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const item = await prisma.navigationItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Navigation item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("[Navigation API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch navigation item" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/navigation/[id]
 * Update a navigation item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateNavigationItemSchema.parse(body);

    const existingItem = await prisma.navigationItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Navigation item not found" },
        { status: 404 }
      );
    }

    // Validate parent if provided
    if (validatedData.parentId !== undefined) {
      if (validatedData.parentId) {
        const parent = await prisma.navigationItem.findUnique({
          where: { id: validatedData.parentId },
        });
        if (!parent) {
          return NextResponse.json(
            { success: false, error: "Parent navigation item not found" },
            { status: 404 }
          );
        }
        if (parent.parentId) {
          return NextResponse.json(
            { success: false, error: "Maximum nesting level is 1." },
            { status: 400 }
          );
        }
        if (validatedData.parentId === id) {
          return NextResponse.json(
            { success: false, error: "Cannot set self as parent" },
            { status: 400 }
          );
        }
      }
    }

    const item = await prisma.navigationItem.update({
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
        resource: "NavigationItem",
        resourceId: item.id,
        before: existingItem,
        after: item,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("[Navigation API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update navigation item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/navigation/[id]
 * Delete a navigation item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;

    const item = await prisma.navigationItem.findUnique({
      where: { id },
      include: {
        // Check for children (if we add relation later)
      },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Navigation item not found" },
        { status: 404 }
      );
    }

    // Check if item has children (submenu items)
    const children = await prisma.navigationItem.findMany({
      where: { parentId: id },
    });

    if (children.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete navigation item with submenu items. Delete submenu items first.",
        },
        { status: 400 }
      );
    }

    await prisma.navigationItem.delete({
      where: { id },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "delete",
        resource: "NavigationItem",
        resourceId: id,
        before: item,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Navigation item deleted successfully",
    });
  } catch (error) {
    console.error("[Navigation API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete navigation item" },
      { status: 500 }
    );
  }
}

