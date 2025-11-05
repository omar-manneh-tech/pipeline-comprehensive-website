/**
 * Admin Blog API
 * CRUD operations for blog posts
 * GET /api/admin/blog - List all blog posts
 * POST /api/admin/blog - Create new blog post
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { getClientIdentifier, rateLimit } from "@/lib/security/rateLimit";

// Rate limiting
const blogRateLimit = {
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: "Too many requests. Please slow down.",
};

// Blog post schema
const blogPostSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  excerpt: z.string().min(1).max(1000),
  content: z.string().min(1),
  image: z.string().url().or(z.string().startsWith("/")),
  category: z.string().min(1),
  tags: z.array(z.string()).or(z.string()), // Accept array or JSON string
  author: z.string().min(1),
  authorRole: z.string().optional(),
  publishedDate: z.string().datetime(),
  readTime: z.number().int().positive(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

// GET - List all blog posts
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const category = searchParams.get("category");
    const published = searchParams.get("published");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      category?: string;
      published?: boolean;
      OR?: Array<{ title: { contains: string } } | { excerpt: { contains: string } }>;
    } = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (published !== null) {
      where.published = published === "true";
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    // Get posts and total count
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedDate: "desc" },
      }),
      prisma.blogPost.count({ where }),
    ]);

    // Parse tags from JSON string
    const postsWithParsedTags = posts.map((post) => ({
      ...post,
      tags: typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags,
    }));

    return NextResponse.json({
      success: true,
      data: postsWithParsedTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
        error: "Failed to fetch blog posts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);

    // Rate limiting
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

    const body = await request.json();

    // Validate input
    const validatedData = blogPostSchema.parse(body);

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug already exists",
          message: "A blog post with this slug already exists.",
        },
        { status: 400 }
      );
    }

    // Convert tags array to JSON string
    const tagsJson =
      typeof validatedData.tags === "string"
        ? validatedData.tags
        : JSON.stringify(validatedData.tags);

    // Create blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        ...validatedData,
        tags: tagsJson,
        publishedDate: new Date(validatedData.publishedDate),
        createdBy: user.userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...blogPost,
          tags: typeof blogPost.tags === "string" ? JSON.parse(blogPost.tags) : blogPost.tags,
        },
      },
      { status: 201 }
    );
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
        error: "Failed to create blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

