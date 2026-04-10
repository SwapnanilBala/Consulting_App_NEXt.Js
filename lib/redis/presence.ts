import { redis } from "./index";

const PRESENCE_KEY = "presence:online";
const PRESENCE_TTL = 120; // seconds — heartbeat should refresh before this

/**
 * Mark a user as online. Call on heartbeat (every ~60s).
 */
export async function setOnline(userId: string): Promise<void> {
  await redis.zadd(PRESENCE_KEY, {
    score: Date.now(),
    member: userId,
  });
}

/**
 * Mark a user as offline explicitly (on disconnect/logout).
 */
export async function setOffline(userId: string): Promise<void> {
  await redis.zrem(PRESENCE_KEY, userId);
}

/**
 * Get all currently online user IDs (active within TTL window).
 */
export async function getOnlineUsers(): Promise<string[]> {
  const cutoff = Date.now() - PRESENCE_TTL * 1000;
  // Remove stale entries
  await redis.zremrangebyscore(PRESENCE_KEY, 0, cutoff);
  // Return remaining
  return redis.zrange(PRESENCE_KEY, 0, -1);
}

/**
 * Check if a specific user is online.
 */
export async function isOnline(userId: string): Promise<boolean> {
  const score = await redis.zscore(PRESENCE_KEY, userId);
  if (score === null) return false;
  return Date.now() - score < PRESENCE_TTL * 1000;
}
