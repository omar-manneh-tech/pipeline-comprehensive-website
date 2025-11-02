/**
 * Database Client
 * Centralized database connection using Prisma
 * 
 * This file provides a singleton Prisma client instance.
 * In production, this ensures proper connection pooling and prevents
 * multiple instances in development.
 * 
 * To use:
 * 1. Install Prisma: npm install @prisma/client prisma
 * 2. Initialize Prisma: npx prisma init
 * 3. Create schema in prisma/schema.prisma
 * 4. Generate client: npx prisma generate
 * 5. Run migrations: npx prisma migrate dev
 * 
 * Example Prisma schema:
 * ```prisma
 * datasource db {
 *   provider = "postgresql" // or "mysql", "sqlite"
 *   url      = env("DATABASE_URL")
 * }
 * 
 * model ContactSubmission {
 *   id        String   @id @default(cuid())
 *   name      String
 *   email     String
 *   phone     String?
 *   subject   String
 *   message   String
 *   createdAt DateTime @default(now())
 * }
 * ```
 */

// Type definition for Prisma Client
import { PrismaClient } from "@prisma/client";

// Global singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma Client instance
 * 
 * This creates a singleton instance of Prisma Client.
 * In development, we reuse the instance across hot reloads.
 * In production, we create a new instance.
 */
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Prevent multiple instances in development (Next.js hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };

/**
 * Example usage:
 * 
 * ```typescript
 * import { prisma } from "@/lib/db/client";
 * 
 * // In an API route
 * export async function POST(request: NextRequest) {
 *   const data = await request.json();
 *   
 *   const submission = await prisma.contactSubmission.create({
 *     data: {
 *       name: data.name,
 *       email: data.email,
 *       subject: data.subject,
 *       message: data.message,
 *     },
 *   });
 *   
 *   return NextResponse.json({ success: true, id: submission.id });
 * }
 * ```
 */

