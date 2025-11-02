# Database Layer

This directory contains the database client and related utilities.

## Setup

1. **Install Prisma:**
   ```bash
   npm install @prisma/client prisma
   ```

2. **Initialize Prisma:**
   ```bash
   npx prisma init
   ```

3. **Configure your database connection** in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/school_db?schema=public"
   ```

4. **Create your schema** in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model ContactSubmission {
     id        String   @id @default(cuid())
     name      String
     email     String
     phone     String?
     subject   String
     message   String
     createdAt DateTime @default(now())
   }

   model Student {
     id        String   @id @default(cuid())
     name      String
     email     String   @unique
     grade     Int
     createdAt DateTime @default(now())
   }

   model Staff {
     id        String   @id @default(cuid())
     name      String
     email     String   @unique
     position  String
     department String
     createdAt DateTime @default(now())
   }
   ```

5. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

6. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

## Usage

Import the Prisma client in your API routes:

```typescript
import { prisma } from "@/lib/db/client";

export async function GET() {
  const students = await prisma.student.findMany();
  return NextResponse.json(students);
}
```

## Supported Databases

- PostgreSQL
- MySQL
- SQLite
- SQL Server
- MongoDB (via Prisma)

## Notes

- The client uses a singleton pattern to prevent multiple instances
- Connection pooling is handled automatically by Prisma
- In development, the client is reused across hot reloads

