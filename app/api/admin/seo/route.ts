/**
 * SEO Management API
 * CRUD operations for page SEO metadata
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const pageSEOSchema = z.object({
  page: z.string().min(1), // Page path (e.g., "/", "/about")
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  ogType: z.string().optional(),
  twitterCard: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

/**
 * GET /api/admin/seo
 * List all page SEO settings
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    const where: any = {};
    if (page) where.page = page;

    const seoSettings = await prisma.pageSEO.findMany({
      where,
      orderBy: { page: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: seoSettings,
    });
  } catch (error) {
    console.error("[SEO API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch SEO settings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo
 * Create new page SEO setting
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = pageSEOSchema.parse(body);

    // Check if SEO setting already exists for this page
    const existing = await prisma.pageSEO.findUnique({
      where: { page: validatedData.page },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "SEO setting already exists for this page. Use PUT to update." },
        { status: 409 }
      );
    }

    const seoSetting = await prisma.pageSEO.create({
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
        resource: "PageSEO",
        resourceId: seoSetting.id,
        after: seoSetting,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: seoSetting,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SEO API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create SEO setting" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo
 * Update page SEO setting (by page path)
 */
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page path is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = pageSEOSchema.partial().extend({ page: z.string().min(1).optional() }).parse(body);

    const existingSetting = await prisma.pageSEO.findUnique({
      where: { page },
    });

    if (!existingSetting) {
      return NextResponse.json(
        { success: false, error: "SEO setting not found for this page" },
        { status: 404 }
      );
    }

    const seoSetting = await prisma.pageSEO.update({
      where: { page },
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

