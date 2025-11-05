/**
 * Database Restore API
 * Restores database from a backup file
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { createAuditLog, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { readFile, writeFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

/**
 * POST /api/admin/backup/restore
 * Restore database from backup
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const { backupFile } = body;

    if (!backupFile) {
      return NextResponse.json(
        { success: false, error: "Backup file name is required" },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const backupDir = path.join(process.cwd(), "backups");
    const backupPath = path.join(backupDir, backupFile);

    // Check if backup file exists
    if (!existsSync(backupPath)) {
      return NextResponse.json(
        { success: false, error: "Backup file not found" },
        { status: 404 }
      );
    }

    // Create backup of current database before restore
    if (existsSync(dbPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
      const preRestoreBackup = path.join(backupDir, `pre_restore_${timestamp}.db`);
      const currentDb = await readFile(dbPath);
      await writeFile(preRestoreBackup, currentDb);
    }

    // Restore from backup
    const backupContent = await readFile(backupPath);
    await writeFile(dbPath, backupContent);

    // Audit log
    await createAuditLog(
      {
        adminId: user.userId,
        action: "restore",
        resource: "Database",
        after: { backupFile, timestamp: new Date().toISOString() },
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Database restored successfully",
      data: {
        backupFile,
        restoredAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Restore API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to restore database" },
      { status: 500 }
    );
  }
}

