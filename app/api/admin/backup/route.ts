/**
 * Database Backup API
 * Triggers database backup via admin UI
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const execAsync = promisify(exec);

/**
 * POST /api/admin/backup
 * Trigger database backup
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const backupDir = path.join(process.cwd(), "backups");

    // Check if database exists
    if (!existsSync(dbPath)) {
      return NextResponse.json(
        { success: false, error: "Database file not found" },
        { status: 404 }
      );
    }

    // Create backup directory if it doesn't exist
    if (!existsSync(backupDir)) {
      await mkdir(backupDir, { recursive: true });
    }

    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const backupFileName = `db_backup_${timestamp}.db`;
    const backupPath = path.join(backupDir, backupFileName);

    // Create backup (copy database file)
    const { readFile } = await import("fs/promises");
    const dbContent = await readFile(dbPath);
    await writeFile(backupPath, dbContent);

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "backup",
        resource: "Database",
        after: { backupFile: backupFileName, timestamp },
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    // Get file size
    const stats = await import("fs/promises").then((m) => m.stat(backupPath));
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    return NextResponse.json({
      success: true,
      message: "Database backup created successfully",
      data: {
        backupFile: backupFileName,
        path: backupPath,
        size: `${fileSizeMB} MB`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Backup API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create database backup" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/backup
 * List available backups
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const backupDir = path.join(process.cwd(), "backups");

    if (!existsSync(backupDir)) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const { readdir, stat } = await import("fs/promises");
    const files = await readdir(backupDir);
    const dbBackups = files.filter((f) => f.endsWith(".db"));

    const backups = await Promise.all(
      dbBackups.map(async (file) => {
        const filePath = path.join(backupDir, file);
        const stats = await stat(filePath);
        return {
          filename: file,
          size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString(),
        };
      })
    );

    // Sort by creation time (newest first)
    backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: backups,
    });
  } catch (error) {
    console.error("[Backup API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to list backups" },
      { status: 500 }
    );
  }
}

