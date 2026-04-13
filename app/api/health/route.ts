import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "NOT SET",
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    ABLY_API_KEY: !!process.env.ABLY_API_KEY,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
  };

  const missing = Object.entries(checks)
    .filter(([, v]) => v === false || v === "NOT SET")
    .map(([k]) => k);

  return NextResponse.json({
    status: missing.length === 0 ? "healthy" : "missing_env_vars",
    missing,
    checks,
  });
}
