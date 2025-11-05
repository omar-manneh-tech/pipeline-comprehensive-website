/**
 * Media Asset API - Individual Asset
 * GET, PUT, DELETE operations for a single media asset
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { promises as fs } from "fs";
import path from "path";

const updateSchema = z.object({
  altText: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * GET /api/admin/media/[id]
 * Get a single media asset
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { success: false, error: "Media asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...asset,
        tags: asset.tags ? JSON.parse(asset.tags) : [],
      },
    });
  } catch (error) {
    console.error("[Media API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch media asset" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/media/[id]
 * Update media asset metadata
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    const existingAsset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json(
        { success: false, error: "Media asset not found" },
        { status: 404 }
      );
    }

    const updateData: any = { ...validatedData };
    if (validatedData.tags) {
      updateData.tags = JSON.stringify(validatedData.tags);
    }

    const asset = await prisma.mediaAsset.update({
      where: { id },
      data: updateData,
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "update",
        resource: "MediaAsset",
        resourceId: asset.id,
        before: existingAsset,
        after: asset,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: {
        ...asset,
        tags: asset.tags ? JSON.parse(asset.tags) : [],
      },
    });
  } catch (error) {
    console.error("[Media API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update media asset" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media/[id]
 * Delete a media asset (soft delete - removes file and database record)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;

    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { success: false, error: "Media asset not found" },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), "public", asset.url);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn("[Media Delete Warning] File not found or already deleted:", fileError);
      // Continue with database deletion even if file doesn't exist
    }

    // Delete database record
    await prisma.mediaAsset.delete({
      where: { id },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "delete",
        resource: "MediaAsset",
        resourceId: id,
        before: asset,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Media asset deleted successfully",
    });
  } catch (error) {
    console.error("[Media API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete media asset" },
      { status: 500 }
    );
  }
}

