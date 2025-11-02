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

// Type definition for Prisma Client (will be available after prisma generate)
// Using 'any' type to prevent TypeScript errors before Prisma is installed
type PrismaClientType = any;

// Global singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

/**
 * Prisma Client instance
 * 
 * Note: This will throw an error until:
 * 1. Prisma is installed: npm install @prisma/client prisma
 * 2. Prisma schema is created and client is generated: npx prisma generate
 */
let prisma: PrismaClientType;

try {
  // Attempt to import and create Prisma Client
  // This will fail if Prisma is not set up yet
  // Using dynamic require to avoid TypeScript errors before Prisma is installed
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PrismaClientModule = require("@prisma/client");
  const { PrismaClient } = PrismaClientModule;
  
  if (PrismaClient) {
    prisma = globalForPrisma.prisma ?? new PrismaClient();

    // Prevent multiple instances in development (Next.js hot reload)
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
    }
  } else {
    throw new Error("PrismaClient not found");
  }
} catch (error) {
  // Prisma not set up yet - provide helpful error
  console.warn(
    "⚠️  Prisma Client not found. Please install and set up Prisma:\n" +
    "   1. npm install @prisma/client prisma\n" +
    "   2. npx prisma init\n" +
    "   3. Create your schema in prisma/schema.prisma\n" +
    "   4. npx prisma generate"
  );

  // Create a mock client for type safety during development
  // This prevents runtime errors but operations will fail if Prisma is not set up
  prisma = {
    $connect: async () => {
      console.warn("⚠️  Prisma is not set up. Database operations will fail.");
    },
    $disconnect: async () => {},
  } as unknown as PrismaClientType;
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

