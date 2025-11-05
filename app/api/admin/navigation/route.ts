/**
 * Navigation Management API
 * CRUD operations for navigation items
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const navigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  parentId: z.string().optional(),
  icon: z.string().optional(),
  target: z.enum(["_self", "_blank"]).default("_self"),
});

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

/**
 * GET /api/admin/navigation
 * List navigation items
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const items = await prisma.navigationItem.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("[Navigation API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch navigation items" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/navigation
 * Create new navigation item
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = navigationItemSchema.parse(body);

    // Validate parent exists if parentId provided
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
      // Ensure parent doesn't have a parent (max 1 level deep)
      if (parent.parentId) {
        return NextResponse.json(
          { success: false, error: "Maximum nesting level is 1. Cannot add submenu to a submenu item." },
          { status: 400 }
        );
      }
    }

    const item = await prisma.navigationItem.create({
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
        resource: "NavigationItem",
        resourceId: item.id,
        after: item,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Navigation API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create navigation item" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/navigation/reorder
 * Reorder navigation items
 */
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const url = new URL(request.url);
    const isReorder = url.pathname.endsWith("/reorder");

    if (isReorder) {
      const body = await request.json();
      const { items } = reorderSchema.parse(body);

      // Get existing items to log before state
      const existingItems = await prisma.navigationItem.findMany({
        where: { id: { in: items.map((i) => i.id) } },
      });

      // Update all items in a transaction
      await prisma.$transaction(
        items.map((item) =>
          prisma.navigationItem.update({
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
          resource: "NavigationItem",
          before: JSON.stringify(existingItems.map((i) => ({ id: i.id, order: i.order }))),
          after: JSON.stringify(items),
          ipAddress: getClientIp(request),
          userAgent: getUserAgent(request),
        },
        request
      );

      return NextResponse.json({
        success: true,
        message: "Navigation order updated successfully",
      });
    }

    // Handle regular update
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = navigationItemSchema.partial().parse(body);

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
      // Prevent setting self as parent
      if (validatedData.parentId === id) {
        return NextResponse.json(
          { success: false, error: "Cannot set self as parent" },
          { status: 400 }
        );
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

