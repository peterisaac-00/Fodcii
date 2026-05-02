import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

declare global {
  namespace Express {
    interface Request {
      dbUserId?: number;
    }
  }
}

/**
 * Resolves the Clerk user ID to a database integer user ID.
 * Creates a DB user record on first login if one doesn't exist yet.
 * Sets req.dbUserId for use in downstream route handlers.
 */
export async function resolveDbUser(req: Request, _res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;

  if (!clerkUserId) {
    return next();
  }

  try {
    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkUserId))
      .limit(1);

    if (existing) {
      req.dbUserId = existing.id;
      return next();
    }

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? `${clerkUserId}@clerk.local`;

    const firstName = clerkUser.firstName ?? "";
    const lastName = clerkUser.lastName ?? "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || primaryEmail.split("@")[0];

    const baseUsername = fullName.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 28);

    let username = baseUsername;
    let suffix = 1;
    while (true) {
      const [taken] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .limit(1);
      if (!taken) break;
      username = `${baseUsername}_${suffix++}`;
    }

    const [newUser] = await db
      .insert(usersTable)
      .values({
        clerkId: clerkUserId,
        username,
        email: primaryEmail,
        passwordHash: "",
        role: "user",
      })
      .returning({ id: usersTable.id });

    req.dbUserId = newUser.id;
  } catch (err: unknown) {
    console.error("[clerk-db-user] Failed to resolve DB user:", err);
  }

  next();
}
