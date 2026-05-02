import rateLimit from "express-rate-limit";
import type { Request } from "express";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler(_req, res) {
    res.set("Retry-After", "900");
    res.status(429).json({ error: "Too many auth attempts. Try again in 15 minutes.", retryAfterSeconds: 900 });
  },
  skip: () => process.env.NODE_ENV === "test",
});

export const submitRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req: Request) => {
    const userId = (req as Request & { user?: { sub?: number } }).user?.sub;
    return userId != null ? `user:${userId}` : (req.ip ?? "anonymous");
  },
  handler(_req, res) {
    res.set("Retry-After", "60");
    res.status(429).json({ error: "Submission rate limit exceeded. Max 15/min.", retryAfterSeconds: 60 });
  },
  skip: () => process.env.NODE_ENV === "test",
});

export const readRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler(_req, res) {
    res.set("Retry-After", "60");
    res.status(429).json({ error: "Rate limit exceeded.", retryAfterSeconds: 60 });
  },
  skip: () => process.env.NODE_ENV === "test",
});
