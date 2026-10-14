import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  let dbUrl = process.env.DATABASE_URL;

  // On Vercel / AWS Lambda serverless functions, the root filesystem is read-only.
  // SQLite requires write access for WAL, journals, locks, and data persistence.
  // We copy the bundled dev.db to the writable /tmp directory if running in serverless.
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless && (!dbUrl || dbUrl.startsWith("file:"))) {
    const tmpDbPath = path.join("/tmp", "dev.db");
    
    // Only copy if /tmp/dev.db doesn't exist yet in this lambda execution environment
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
        path.join(__dirname, "..", "..", "prisma", "dev.db"),
        path.join(__dirname, "dev.db"),
      ];

      let found = false;
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            found = true;
            break;
          } catch (err) {
            console.error(`Failed to copy SQLite database from ${candidate} to ${tmpDbPath}:`, err);
          }
        }
      }

      if (!found) {
        console.warn("Source dev.db not found in candidate paths; /tmp/dev.db may be created fresh by Prisma.");
      }
    }

    dbUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = dbUrl;
  }

  return new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
