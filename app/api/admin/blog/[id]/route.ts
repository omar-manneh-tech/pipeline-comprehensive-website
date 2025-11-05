/**
 * Admin Blog API - Single Post
 * GET /api/admin/blog/[id] - Get single blog post
 * PUT /api/admin/blog/[id] - Update blog post
 * DELETE /api/admin/blog/[id] - Delete blog post
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { getClientIdentifier, rateLimit } from "@/lib/security/rateLimit";

const blogRateLimit = {
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: "Too many requests. Please slow down.",
};

const blogPostUpdateSchema = z.object({
  slug: z.string().min(1).max(200).optional(),
  title: z.string().min(1).max(500).optional(),
  excerpt: z.string().min(1).max(1000).optional(),
  content: z.string().min(1).optional(),
  image: z.string().url().or(z.string().startsWith("/")).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
  author: z.string().min(1).optional(),
  authorRole: z.string().optional(),
  publishedDate: z.string().datetime().optional(),
  readTime: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);

    const { id } = await params;

    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!blogPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Blog post not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...blogPost,
        tags: typeof blogPost.tags === "string" ? JSON.parse(blogPost.tags) : blogPost.tags,
      },
    });
  } catch (error) {
    console.error("[Blog API Error]", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);

    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, blogRateLimit);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests",
          message: blogRateLimit.message,
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Blog post not found",
        },
        { status: 404 }
      );
    }

    // Validate input
    const validatedData = blogPostUpdateSchema.parse(body);

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          {
            success: false,
            error: "Slug already exists",
            message: "A blog post with this slug already exists.",
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      [key: string]: unknown;
    } = { ...validatedData };

    // Convert tags to JSON if provided
    if (validatedData.tags !== undefined) {
      updateData.tags =
        typeof validatedData.tags === "string"
          ? validatedData.tags
          : JSON.stringify(validatedData.tags);
    }

    // Convert publishedDate if provided
    if (validatedData.publishedDate) {
      updateData.publishedDate = new Date(validatedData.publishedDate);
    }

    // Add updatedBy
    updateData.updatedBy = user.userId;

    // Update blog post
    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...blogPost,
        tags: typeof blogPost.tags === "string" ? JSON.parse(blogPost.tags) : blogPost.tags,
      },
    });
  } catch (error) {
    console.error("[Blog API Error]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);

    const { id } = await params;

    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!blogPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Blog post not found",
        },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("[Blog API Error]", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

