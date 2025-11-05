/**
 * Public Page Content API
 * Returns visible page content sections for frontend
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * GET /api/site/pages
 * Get visible page content sections
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page parameter is required" },
        { status: 400 }
      );
    }

    const sections = await prisma.pageContent.findMany({
      where: {
        page,
        visible: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Parse JSON content
    const sectionsWithParsedContent = sections.map((section) => ({
      ...section,
      content: typeof section.content === "string" 
        ? JSON.parse(section.content) 
        : section.content,
    }));

    return NextResponse.json({
      success: true,
      data: sectionsWithParsedContent,
    });
  } catch (error) {
    console.error("[Page Content API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}

