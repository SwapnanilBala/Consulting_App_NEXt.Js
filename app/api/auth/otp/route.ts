import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateOTP, verifyOTP } from "@/lib/redis/otp";
import { authRateLimit } from "@/lib/redis/rate-limit";

// ── POST /api/auth/otp { action: "generate" | "verify", ... } ──

const generateSchema = z.object({
  action: z.literal("generate"),
  email: z.string().email(),
});

const verifySchema = z.object({
  action: z.literal("verify"),
  email: z.string().email(),
  code: z.string().length(6),
});

const bodySchema = z.discriminatedUnion("action", [generateSchema, verifySchema]);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Rate limit on the email address
  const { success } = await authRateLimit.limit(data.email);
  if (!success) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait and try again." },
      { status: 429 }
    );
  }

  if (data.action === "generate") {
    const code = await generateOTP(data.email);
    // In production, send this code via email/SMS.
    // For development, we return it in the response.
    return NextResponse.json({
      ok: true,
      // Remove `code` in production — only for dev/testing
      ...(process.env.NODE_ENV === "development" && { code }),
    });
  }

  // action === "verify"
  const valid = await verifyOTP(data.email, data.code);
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, verified: true });
}
