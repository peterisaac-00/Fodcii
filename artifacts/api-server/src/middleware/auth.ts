import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: { sub: number; username: string; role: string };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (userId) {
    req.userId = userId;
  }
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const [user] = await db
      .select({ role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkUserId))
      .limit(1);

    if (!user || user.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
  } catch {
    res.status(500).json({ error: "Failed to verify admin role" });
    return;
  }

  next();
}

export function signToken(_payload: unknown): string {
  throw new Error("signToken is no longer used — auth is handled by Clerk");
}
