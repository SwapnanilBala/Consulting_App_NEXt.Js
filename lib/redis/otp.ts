import { redis } from "./index";

const OTP_PREFIX = "otp:";
const OTP_TTL = 300; // 5 minutes

function otpKey(identifier: string): string {
  return `${OTP_PREFIX}${identifier}`;
}

/**
 * Generate a 6-digit OTP and store it with TTL.
 */
export async function generateOTP(identifier: string): Promise<string> {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await redis.set(otpKey(identifier), code, { ex: OTP_TTL });
  return code;
}

/**
 * Verify an OTP. Deletes on success to prevent reuse.
 */
export async function verifyOTP(
  identifier: string,
  code: string
): Promise<boolean> {
  const stored = await redis.get<string>(otpKey(identifier));
  if (!stored || stored !== code) return false;
  await redis.del(otpKey(identifier));
  return true;
}

/**
 * Invalidate an OTP manually.
 */
export async function invalidateOTP(identifier: string): Promise<void> {
  await redis.del(otpKey(identifier));
}
