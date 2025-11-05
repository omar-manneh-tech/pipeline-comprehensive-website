/**
 * Media Library API
 * CRUD operations for media assets
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { getClientIdentifier, rateLimit } from "@/lib/security/rateLimit";

// Upload validation schema
const uploadSchema = z.object({
  folder: z.enum(["blog", "staff", "gallery", "news", "pages", "testimonials"]).default("pages"),
});

// Rate limiting for upload endpoint
const uploadRateLimit = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 uploads per minute
  message: "Too many upload requests. Please slow down.",
};

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Image dimensions by folder
const IMAGE_CONFIG = {
  blog: { width: 1200, height: 630, quality: 90 },
  staff: { width: 400, height: 400, quality: 90 },
  gallery: { width: 1920, height: 1080, quality: 85 },
  news: { width: 1200, height: 630, quality: 90 },
  pages: { width: 1920, height: 1080, quality: 85 },
  testimonials: { width: 200, height: 200, quality: 90 },
};

/**
 * GET /api/admin/media
 * List media assets with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const folder = searchParams.get("folder");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (folder) where.folder = folder;
    if (search) {
      where.OR = [
        { filename: { contains: search } },
        { originalName: { contains: search } },
        { title: { contains: search } },
      ];
    }

    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: assets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Media API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch media assets" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/media/upload
 * Upload a new media asset
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);

    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, uploadRateLimit);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests",
          message: uploadRateLimit.message,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string || "pages";
    const altText = formData.get("altText") as string | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate folder
    const folderValidation = uploadSchema.parse({ folder });
    const validatedFolder = folderValidation.folder;

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Sanitize filename
    const sanitizedFilename = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    const timestamp = Date.now();
    const filename = `${timestamp}-${sanitizedFilename}`;

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", validatedFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Process file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    const config = IMAGE_CONFIG[validatedFolder as keyof typeof IMAGE_CONFIG] || IMAGE_CONFIG.pages;

    // Optimize image
    let width: number | undefined;
    let height: number | undefined;
    
    if (file.type.startsWith("image/")) {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      width = metadata.width || config.width;
      height = metadata.height || config.height;

      // Resize if needed
      if (width > config.width || height > config.height) {
        await image
          .resize(config.width, config.height, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: config.quality })
          .toFile(filePath);
      } else {
        await fs.writeFile(filePath, buffer);
      }
    } else {
      await fs.writeFile(filePath, buffer);
    }

    // Create database record
    const url = `/uploads/${validatedFolder}/${filename}`;
    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalName: file.name,
        url,
        path: filePath,
        folder: validatedFolder,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        altText: altText || null,
        title: title || null,
        description: description || null,
        uploadedBy: user.userId,
      },
    });

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "create",
        resource: "MediaAsset",
        resourceId: asset.id,
        after: asset,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        data: asset,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Media Upload Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to upload media asset" },
      { status: 500 }
    );
  }
}

