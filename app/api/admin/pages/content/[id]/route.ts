/**
 * Page Content API - Individual Section
 * GET, PUT, DELETE operations for a single page content section
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const updatePageContentSchema = z.object({
  content: z.union([z.string(), z.record(z.any())]).optional(),
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
  published: z.boolean().optional(),
});

/**
 * GET /api/admin/pages/content/[id]
 * Get a single page content section
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const pageContent = await prisma.pageContent.findUnique({
      where: { id },
    });

    if (!pageContent) {
      return NextResponse.json(
        { success: false, error: "Page content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...pageContent,
        content: JSON.parse(pageContent.content),
      },
    });
  } catch (error) {
    console.error("[Page Content API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/pages/content/[id]
 * Update a page content section
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const validatedData = updatePageContentSchema.parse(body);

    const existingContent = await prisma.pageContent.findUnique({
      where: { id },
    });

    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: "Page content not found" },
        { status: 404 }
      );
    }

    // Convert content to JSON string if it's an object
    const updateData: any = { ...validatedData };
    if (validatedData.content !== undefined) {
      updateData.content =
        typeof validatedData.content === "string"
          ? validatedData.content
          : JSON.stringify(validatedData.content);
    }

    const pageContent = await prisma.pageContent.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: user.userId,
      },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "update",
        resource: "PageContent",
        resourceId: pageContent.id,
        before: existingContent,
        after: pageContent,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: {
        ...pageContent,
        content: JSON.parse(pageContent.content),
      },
    });
  } catch (error) {
    console.error("[Page Content API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update page content" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/pages/content/[id]
 * Delete a page content section
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;

    const pageContent = await prisma.pageContent.findUnique({
      where: { id },
    });

    if (!pageContent) {
      return NextResponse.json(
        { success: false, error: "Page content not found" },
        { status: 404 }
      );
    }

    await prisma.pageContent.delete({
      where: { id },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "delete",
        resource: "PageContent",
        resourceId: id,
        before: pageContent,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Page content deleted successfully",
    });
  } catch (error) {
    console.error("[Page Content API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete page content" },
      { status: 500 }
    );
  }
}

