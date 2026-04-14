import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const authUrl =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.VERCEL_URL ??
    "NOT SET";

  const checks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    AUTH_SECRET: !!authSecret,
    AUTH_URL: authUrl,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    AUTH_SECRET_FALLBACK: !!process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "NOT SET",
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    ABLY_API_KEY: !!process.env.ABLY_API_KEY,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
  };

  const missing = [
    ["DATABASE_URL", checks.DATABASE_URL],
    ["AUTH_SECRET", checks.AUTH_SECRET],
    ["GOOGLE_CLIENT_ID", checks.GOOGLE_CLIENT_ID],
    ["GOOGLE_CLIENT_SECRET", checks.GOOGLE_CLIENT_SECRET],
    ["ABLY_API_KEY", checks.ABLY_API_KEY],
    ["UPSTASH_REDIS_REST_URL", checks.UPSTASH_REDIS_REST_URL],
    ["UPSTASH_REDIS_REST_TOKEN", checks.UPSTASH_REDIS_REST_TOKEN],
  ]
    .filter(([, value]) => value === false)
    .map(([key]) => key);

  return NextResponse.json({
    status: missing.length === 0 ? "healthy" : "missing_env_vars",
    missing,
    checks,
  });
}
