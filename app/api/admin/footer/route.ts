/**
 * Footer Management API
 * CRUD operations for footer sections and links
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const footerSectionSchema = z.object({
  type: z.enum(["quick_links", "programs", "custom"]),
  title: z.string().min(1),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

const footerLinkSchema = z.object({
  sectionId: z.string(),
  label: z.string().min(1),
  href: z.string().min(1),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

const reorderSectionsSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

const reorderLinksSchema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

/**
 * GET /api/admin/footer/sections
 * List all footer sections
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {};
    if (type) where.type = type;

    const sections = await prisma.footerSection.findMany({
      where,
      include: {
        links: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error("[Footer API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer sections" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/footer/sections
 * Create new footer section
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const url = new URL(request.url);
    const isLink = url.pathname.endsWith("/links");

    if (isLink) {
      // Handle footer link creation
      const body = await request.json();
      const validatedData = footerLinkSchema.parse(body);

      // Verify section exists
      const section = await prisma.footerSection.findUnique({
        where: { id: validatedData.sectionId },
      });

      if (!section) {
        return NextResponse.json(
          { success: false, error: "Footer section not found" },
          { status: 404 }
        );
      }

      const link = await prisma.footerLink.create({
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
          resource: "FooterLink",
          resourceId: link.id,
          after: link,
          ipAddress: getClientIp(request),
          userAgent: getUserAgent(request),
        },
        request
      );

      return NextResponse.json(
        {
          success: true,
          data: link,
        },
        { status: 201 }
      );
    }

    // Handle footer section creation
    const body = await request.json();
    const validatedData = footerSectionSchema.parse(body);

    const section = await prisma.footerSection.create({
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
        resource: "FooterSection",
        resourceId: section.id,
        after: section,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: section,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Footer API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create footer section/link" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/footer/sections/reorder
 * Reorder footer sections
 */
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const url = new URL(request.url);
    const isReorderSections = url.pathname.endsWith("/sections/reorder");
    const isReorderLinks = url.pathname.endsWith("/links/reorder");

    if (isReorderSections) {
      // Handle section reordering
      const body = await request.json();
      const { sections } = reorderSectionsSchema.parse(body);

      const existingSections = await prisma.footerSection.findMany({
        where: { id: { in: sections.map((s) => s.id) } },
      });

      await prisma.$transaction(
        sections.map((section) =>
          prisma.footerSection.update({
            where: { id: section.id },
            data: { order: section.order },
          })
        )
      );

      // Audit log
      await createAuditLog(
        {
          adminId: user.userId,
          action: "reorder",
          resource: "FooterSection",
          before: existingSections.map((s) => ({ id: s.id, order: s.order })) as unknown as Record<string, unknown>,
          after: sections as unknown as Record<string, unknown>,
          ipAddress: getClientIp(request),
          userAgent: getUserAgent(request),
        },
        request
      );

      return NextResponse.json({
        success: true,
        message: "Footer sections order updated successfully",
      });
    }

    if (isReorderLinks) {
      // Handle link reordering
      const body = await request.json();
      const { links } = reorderLinksSchema.parse(body);

      const existingLinks = await prisma.footerLink.findMany({
        where: { id: { in: links.map((l) => l.id) } },
      });

      await prisma.$transaction(
        links.map((link) =>
          prisma.footerLink.update({
            where: { id: link.id },
            data: { order: link.order },
          })
        )
      );

      // Audit log
      await createAuditLog(
        {
          adminId: user.userId,
          action: "reorder",
          resource: "FooterLink",
          before: existingLinks.map((l) => ({ id: l.id, order: l.order })) as unknown as Record<string, unknown>,
          after: links as unknown as Record<string, unknown>,
          ipAddress: getClientIp(request),
          userAgent: getUserAgent(request),
        },
        request
      );

      return NextResponse.json({
        success: true,
        message: "Footer links order updated successfully",
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
    const isLink = url.pathname.includes("/links/");

    if (isLink) {
      // Update footer link
      const validatedData = footerLinkSchema.partial().parse(body);

      const existingLink = await prisma.footerLink.findUnique({
        where: { id },
      });

      if (!existingLink) {
        return NextResponse.json(
          { success: false, error: "Footer link not found" },
          { status: 404 }
        );
      }

      const link = await prisma.footerLink.update({
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
          resource: "FooterLink",
          resourceId: link.id,
          before: existingLink,
          after: link,
          ipAddress: getClientIp(request),
          userAgent: getUserAgent(request),
        },
        request
      );

      return NextResponse.json({
        success: true,
        data: link,
      });
    }

    // Update footer section
    const validatedData = footerSectionSchema.partial().parse(body);

    const existingSection = await prisma.footerSection.findUnique({
      where: { id },
    });

    if (!existingSection) {
      return NextResponse.json(
        { success: false, error: "Footer section not found" },
        { status: 404 }
      );
    }

    const section = await prisma.footerSection.update({
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
        resource: "FooterSection",
        resourceId: section.id,
        before: existingSection,
        after: section,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("[Footer API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update footer section/link" },
      { status: 500 }
    );
  }
}

