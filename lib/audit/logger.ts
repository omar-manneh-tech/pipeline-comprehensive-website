/**
 * Audit Log Service
 * Centralized audit logging for all admin actions
 */

import { prisma } from "@/lib/db/client";
import { NextRequest } from "next/server";

export interface AuditLogData {
  adminId: string;
  action: string; // "create", "update", "delete", "publish", "unpublish", etc.
  resource: string; // "PageContent", "MediaAsset", "NavigationItem", etc.
  resourceId?: string;
  before?: any; // Previous state (for updates)
  after?: any; // New state (for creates/updates)
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return undefined;
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: NextRequest): string | undefined {
  return request.headers.get("user-agent") || undefined;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  data: AuditLogData,
  request?: NextRequest
): Promise<void> {
  try {
    const ipAddress = request ? getClientIp(request) : data.ipAddress;
    const userAgent = request ? getUserAgent(request) : data.userAgent;

    await prisma.auditLog.create({
      data: {
        adminId: data.adminId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        before: data.before ? JSON.stringify(data.before) : null,
        after: data.after ? JSON.stringify(data.after) : null,
        ipAddress: ipAddress,
        userAgent: userAgent,
      },
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not break the main flow
    console.error("[Audit Log Error]", error);
  }
}

/**
 * Get audit logs with pagination
 */
export async function getAuditLogs(options: {
  page?: number;
  limit?: number;
  adminId?: string;
  resource?: string;
  action?: string;
}) {
  const page = options.page || 1;
  const limit = options.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (options.adminId) where.adminId = options.adminId;
  if (options.resource) where.resource = options.resource;
  if (options.action) where.action = options.action;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs: logs.map((log) => ({
      ...log,
      before: log.before ? JSON.parse(log.before) : null,
      after: log.after ? JSON.parse(log.after) : null,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

