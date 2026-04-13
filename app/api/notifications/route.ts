import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

// ── GET /api/notifications?userId=xxx&unreadOnly=true&limit=20 ──

const getSchema = z.object({
  userId: z.string().uuid(),
  unreadOnly: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = getSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, unreadOnly, limit = 20 } = parsed.data;

  const conditions = [eq(notifications.userId, userId)];
  if (unreadOnly === "true") {
    conditions.push(eq(notifications.isRead, false));
  }

  const rows = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);

  // Always get unread count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

  return NextResponse.json({ notifications: rows, unreadCount: Number(count) });
}

// ── PATCH /api/notifications (mark single as read) ──

const patchSchema = z.object({
  notificationId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { notificationId, userId } = parsed.data;

  const [updated] = await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  return NextResponse.json({ notification: updated });
}
