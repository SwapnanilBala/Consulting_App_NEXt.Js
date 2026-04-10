import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { subscriptions, invoices, paymentMethods } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// ── GET /api/billing?userId=xxx ──
// Returns subscription, payment methods, and recent invoices.

const getSchema = z.object({
  userId: z.string().uuid(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = getSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId } = parsed.data;

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  const methods = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, userId))
    .orderBy(desc(paymentMethods.createdAt));

  let recentInvoices: (typeof invoices.$inferSelect)[] = [];
  if (subscription) {
    recentInvoices = await db
      .select()
      .from(invoices)
      .where(eq(invoices.subscriptionId, subscription.id))
      .orderBy(desc(invoices.issuedAt))
      .limit(10);
  }

  return NextResponse.json({
    subscription: subscription ?? null,
    paymentMethods: methods,
    invoices: recentInvoices,
  });
}

// ── PATCH /api/billing (update subscription status) ──

const patchSchema = z.object({
  subscriptionId: z.string().uuid(),
  status: z.enum(["active", "past_due", "cancelled", "trialing"]).optional(),
  plan: z.string().max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { subscriptionId, ...updates } = parsed.data;

  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (updates.status) values.status = updates.status;
  if (updates.plan) values.plan = updates.plan;

  const [updated] = await db
    .update(subscriptions)
    .set(values)
    .where(eq(subscriptions.id, subscriptionId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  return NextResponse.json({ subscription: updated });
}
