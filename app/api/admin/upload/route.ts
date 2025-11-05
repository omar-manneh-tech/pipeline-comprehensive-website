/**
 * Admin Upload API
 * POST /api/admin/upload
 * 
 * Handles file uploads for CMS content
 * Requires admin authentication
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";
import { getClientIdentifier, rateLimit } from "@/lib/security/rateLimit";

// Upload validation schema
const uploadSchema = z.object({
  folder: z.enum(["blog", "staff", "gallery", "news"]).default("gallery"),
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
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Image dimensions
const IMAGE_CONFIG = {
  blog: { width: 1200, height: 630, quality: 90 },
  staff: { width: 400, height: 400, quality: 90 },
  gallery: { width: 1920, height: 1080, quality: 85 },
  news: { width: 1200, height: 630, quality: 90 },
};

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
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
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    // Validate file
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 }
      );
    }

    // Validate folder
    const folderResult = uploadSchema.safeParse({ folder: folder || "gallery" });
    if (!folderResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid folder",
          details: folderResult.error.issues,
        },
        { status: 400 }
      );
    }

    const validFolder = folderResult.data.folder;

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type",
          message: `Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File too large",
          message: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${validFolder}-${timestamp}-${randomString}.${extension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", validFolder);
    const thumbnailDir = join(uploadDir, "thumbnails");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    if (!existsSync(thumbnailDir)) {
      await mkdir(thumbnailDir, { recursive: true });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get image configuration
    const config = IMAGE_CONFIG[validFolder];

    // Optimize and resize image
    const optimizedImage = await sharp(buffer)
      .resize(config.width, config.height, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: config.quality })
      .toBuffer();

    // Create thumbnail (200x200)
    const thumbnail = await sharp(buffer)
      .resize(200, 200, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Save optimized image
    const imagePath = join(uploadDir, filename);
    await writeFile(imagePath, optimizedImage);

    // Save thumbnail
    const thumbnailPath = join(thumbnailDir, filename);
    await writeFile(thumbnailPath, thumbnail);

    // Return success response
    const imageUrl = `/uploads/${validFolder}/${filename}`;
    const thumbnailUrl = `/uploads/${validFolder}/thumbnails/${filename}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          url: imageUrl,
          thumbnailUrl: thumbnailUrl,
          filename: filename,
          size: optimizedImage.length,
          folder: validFolder,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Upload Error]", error);

    // Handle authentication errors
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required. Please log in to access admin features.",
        },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove uploaded files
export async function DELETE(request: NextRequest) {
  try {
    // Require admin authentication
    requireAdmin(request);

    // Parse request body
    const body = await request.json();
    const { filename, folder } = body;

    if (!filename || !folder) {
      return NextResponse.json(
        {
          success: false,
          error: "Filename and folder are required",
        },
        { status: 400 }
      );
    }

    // Validate folder
    const folderResult = uploadSchema.safeParse({ folder });
    if (!folderResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid folder",
        },
        { status: 400 }
      );
    }

    // Delete files
    const { unlink } = await import("fs/promises");
    const { join } = await import("path");
    const { existsSync } = await import("fs");

    const imagePath = join(process.cwd(), "public", "uploads", folder, filename);
    const thumbnailPath = join(
      process.cwd(),
      "public",
      "uploads",
      folder,
      "thumbnails",
      filename
    );

    try {
      if (existsSync(imagePath)) {
        await unlink(imagePath);
      }
      if (existsSync(thumbnailPath)) {
        await unlink(thumbnailPath);
      }

      return NextResponse.json(
        {
          success: true,
          message: "File deleted successfully",
        },
        { status: 200 }
      );
    } catch (deleteError) {
      console.error("[Delete Error]", deleteError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete file",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Delete Error]", error);

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
        error: "Delete failed",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

