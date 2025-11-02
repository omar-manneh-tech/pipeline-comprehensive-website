/**
 * Authentication Middleware
 * Middleware functions for protecting routes
 */

import { NextRequest } from "next/server";
import { verifyToken, extractTokenFromHeader } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Verify authentication token from request
 */
export function verifyAuth(request: NextRequest): {
  authenticated: boolean;
  user?: {
    userId: string;
    email: string;
    role: string;
  };
} {
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return { authenticated: false };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    user: {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    },
  };
}

/**
 * Require authentication - throws error if not authenticated
 */
export function requireAuth(request: NextRequest): {
  userId: string;
  email: string;
  role: string;
} {
  const auth = verifyAuth(request);
  
  if (!auth.authenticated || !auth.user) {
    throw new Error("Unauthorized");
  }
  
  return auth.user;
}

/**
 * Require admin role
 */
export function requireAdmin(request: NextRequest): {
  userId: string;
  email: string;
  role: string;
} {
  const user = requireAuth(request);
  
  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new Error("Forbidden: Admin access required");
  }
  
  return user;
}

