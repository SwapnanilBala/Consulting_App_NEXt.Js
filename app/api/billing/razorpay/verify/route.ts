import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { env } from "@/lib/env";

const verifySchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  plan: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = verifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    plan,
  } = parsed.data;

  // Verify signature using HMAC SHA256
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Invalid payment signature" },
      { status: 400 }
    );
  }

  // TODO: Update subscription in DB for the authenticated user
  // - Fetch session user
  // - Upsert subscription with plan & status "active"
  // - Create invoice record with status "paid"

  return NextResponse.json({
    success: true,
    paymentId: razorpay_payment_id,
    plan,
  });
}
