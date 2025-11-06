/**
 * Page Content API
 * CRUD operations for page content sections
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const pageContentSchema = z.object({
  page: z.string().min(1),
  section: z.string().min(1),
  content: z.union([z.string(), z.record(z.string(), z.any())]), // JSON string or object
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  published: z.boolean().default(true),
});

const updatePageContentSchema = pageContentSchema.partial().extend({
  page: z.string().min(1).optional(),
  section: z.string().min(1).optional(),
});

/**
 * GET /api/admin/pages/content
 * List page content with filtering
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const section = searchParams.get("section");
    const published = searchParams.get("published");
    const visible = searchParams.get("visible");

    const where: Record<string, unknown> = {};
    if (page) where.page = page;
    if (section) where.section = section;
    if (published !== null) where.published = published === "true";
    if (visible !== null) where.visible = visible === "true";

    const contents = await prisma.pageContent.findMany({
      where,
      orderBy: [{ page: "asc" }, { order: "asc" }],
    });

    // Parse JSON content
    const contentsWithParsedContent = contents.map((content) => ({
      ...content,
      content: typeof content.content === "string" ? JSON.parse(content.content) : content.content,
    }));

    return NextResponse.json({
      success: true,
      data: contentsWithParsedContent,
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
 * POST /api/admin/pages/content
 * Create new page content section
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = pageContentSchema.parse(body);

    // Convert content to JSON string if it's an object
    const contentJson =
      typeof validatedData.content === "string"
        ? validatedData.content
        : JSON.stringify(validatedData.content);

    // Check if page content already exists
    const existing = await prisma.pageContent.findUnique({
      where: {
        page_section: {
          page: validatedData.page,
          section: validatedData.section,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Page content section already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    const pageContent = await prisma.pageContent.create({
      data: {
        page: validatedData.page,
        section: validatedData.section,
        content: contentJson,
        order: validatedData.order,
        visible: validatedData.visible,
        published: validatedData.published,
        updatedBy: user.userId,
      },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "create",
        resource: "PageContent",
        resourceId: pageContent.id,
        after: pageContent,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          ...pageContent,
          content: JSON.parse(pageContent.content),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Page Content API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create page content" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/pages/content
 * Update page content section (by id or page+section)
 */
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = searchParams.get("page");
    const section = searchParams.get("section");

    if (!id && !(page && section)) {
      return NextResponse.json(
        { success: false, error: "Either id or page+section must be provided" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updatePageContentSchema.parse(body);

    // Find existing content
    let existingContent;
    if (id) {
      existingContent = await prisma.pageContent.findUnique({
        where: { id },
      });
    } else if (page && section) {
      existingContent = await prisma.pageContent.findUnique({
        where: {
          page_section: {
            page,
            section,
          },
        },
      });
    }

    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: "Page content not found" },
        { status: 404 }
      );
    }

    // Convert content to JSON string if it's an object
    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.content !== undefined) {
      updateData.content =
        typeof validatedData.content === "string"
          ? validatedData.content
          : JSON.stringify(validatedData.content);
    }

    const pageContent = await prisma.pageContent.update({
      where: { id: existingContent.id },
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

