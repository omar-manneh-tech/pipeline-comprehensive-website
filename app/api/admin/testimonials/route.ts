/**
 * Testimonials API
 * CRUD operations for testimonials
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  text: z.string().min(1),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

/**
 * GET /api/admin/testimonials
 * List testimonials with filtering
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const published = searchParams.get("published");

    const where: any = {};
    if (featured !== null) where.featured = featured === "true";
    if (published !== null) where.published = published === "true";

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("[Testimonials API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/testimonials
 * Create new testimonial
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        ...validatedData,
        createdBy: user.userId,
      },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "create",
        resource: "Testimonial",
        resourceId: testimonial.id,
        after: testimonial,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: testimonial,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Testimonials API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

