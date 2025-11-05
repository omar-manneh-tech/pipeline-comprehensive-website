/**
 * Page SEO API - Individual Page
 * GET, PUT, DELETE operations for a single page's SEO settings
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const updatePageSEOSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  ogType: z.string().optional(),
  twitterCard: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

/**
 * GET /api/admin/seo/[page]
 * Get SEO settings for a specific page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    requireAdmin(request);
    const { page } = await params;
    const decodedPage = decodeURIComponent(page);

    const seoSetting = await prisma.pageSEO.findUnique({
      where: { page: decodedPage },
    });

    if (!seoSetting) {
      return NextResponse.json(
        { success: false, error: "SEO setting not found for this page" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: seoSetting,
    });
  } catch (error) {
    console.error("[SEO API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch SEO setting" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/[page]
 * Update SEO settings for a specific page
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { page } = await params;
    const decodedPage = decodeURIComponent(page);
    const body = await request.json();
    const validatedData = updatePageSEOSchema.parse(body);

    const existingSetting = await prisma.pageSEO.findUnique({
      where: { page: decodedPage },
    });

    if (!existingSetting) {
      // Create if doesn't exist
      const seoSetting = await prisma.pageSEO.create({
        data: {
          page: decodedPage,
          title: validatedData.title || decodedPage,
          description: validatedData.description || "",
          keywords: validatedData.keywords,
          ogImage: validatedData.ogImage,
          ogType: validatedData.ogType,
          twitterCard: validatedData.twitterCard,
          canonicalUrl: validatedData.canonicalUrl,
          updatedBy: user.userId,
        },
      });

      // Audit log
      await createAuditLog(
        {
          adminId: user.userId,
          action: "create",
          resource: "PageSEO",
          resourceId: seoSetting.id,
          after: seoSetting,
          ipAddress: getClientIp(request),
          userAgent: getUserAgent(request),
        },
        request
      );

      return NextResponse.json({
        success: true,
        data: seoSetting,
      });
    }

    const seoSetting = await prisma.pageSEO.update({
      where: { page: decodedPage },
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
        resource: "PageSEO",
        resourceId: seoSetting.id,
        before: existingSetting,
        after: seoSetting,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: seoSetting,
    });
  } catch (error) {
    console.error("[SEO API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update SEO setting" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/seo/[page]
 * Delete SEO settings for a specific page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { page } = await params;
    const decodedPage = decodeURIComponent(page);

    const seoSetting = await prisma.pageSEO.findUnique({
      where: { page: decodedPage },
    });

    if (!seoSetting) {
      return NextResponse.json(
        { success: false, error: "SEO setting not found for this page" },
        { status: 404 }
      );
    }

    await prisma.pageSEO.delete({
      where: { page: decodedPage },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "delete",
        resource: "PageSEO",
        resourceId: seoSetting.id,
        before: seoSetting,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "SEO setting deleted successfully",
    });
  } catch (error) {
    console.error("[SEO API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete SEO setting" },
      { status: 500 }
    );
  }
}

