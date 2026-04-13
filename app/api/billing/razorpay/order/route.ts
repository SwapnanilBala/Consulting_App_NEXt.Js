import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRazorpay } from "@/lib/razorpay/client";
import { env } from "@/lib/env";

const orderSchema = z.object({
  plan: z.string().min(1).max(100),
  amount: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { plan, amount } = parsed.data;

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      notes: { plan },
    });

    return NextResponse.json({
      orderId: order.id,
      key: env.RAZORPAY_KEY_ID,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
