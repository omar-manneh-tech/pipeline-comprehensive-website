/**
 * Admin Gallery API
 * CRUD operations for gallery items
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";

const gallerySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().min(1),
  category: z.string().min(1),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const published = searchParams.get("published");

    const where: { category?: string; published?: boolean } = {};
    if (category) where.category = category;
    if (published !== null) where.published = published === "true";

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("[Gallery API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = gallerySchema.parse(body);

    const item = await prisma.galleryItem.create({
      data: {
        ...validatedData,
        createdBy: user.userId,
      },
    });

    return NextResponse.json(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Gallery API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}

