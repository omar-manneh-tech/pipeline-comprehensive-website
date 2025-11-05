/**
 * Admin News & Events API
 * CRUD operations for news and events
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";

const newsEventSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  excerpt: z.string().min(1).max(1000),
  content: z.string().min(1),
  image: z.string().optional(),
  type: z.enum(["news", "event"]),
  eventDate: z.string().datetime().optional(),
  location: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const published = searchParams.get("published");

    const where: { type?: string; published?: boolean } = {};
    if (type) where.type = type;
    if (published !== null) where.published = published === "true";

    const items = await prisma.newsEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("[News API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news & events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = newsEventSchema.parse(body);

    // Check if slug exists
    const existing = await prisma.newsEvent.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }

    const item = await prisma.newsEvent.create({
      data: {
        ...validatedData,
        eventDate: validatedData.eventDate ? new Date(validatedData.eventDate) : null,
        createdBy: user.userId,
      },
    });

    return NextResponse.json(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error) {
    console.error("[News API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create news/event" },
      { status: 500 }
    );
  }
}

