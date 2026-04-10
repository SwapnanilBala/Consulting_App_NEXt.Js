import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./index";

/**
 * General API rate limiter — 60 requests per 60 seconds per key.
 */
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  prefix: "ratelimit:api",
  analytics: true,
});

/**
 * Stricter rate limit for auth/OTP — 5 attempts per 15 minutes.
 */
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "ratelimit:auth",
  analytics: true,
});

/**
 * Message send rate limit — 30 messages per 60 seconds.
 */
export const messageRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "60 s"),
  prefix: "ratelimit:messages",
  analytics: true,
});
