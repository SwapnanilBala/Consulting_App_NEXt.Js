import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

// ── GET /api/sessions?userId=xxx&status=scheduled ──

const getSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]).optional(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = getSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, status } = parsed.data;

  const conditions = [
    eq(sessions.clientId, userId),
    ...(status ? [eq(sessions.status, status)] : []),
  ];

  const rows = await db
    .select()
    .from(sessions)
    .where(and(...conditions))
    .orderBy(desc(sessions.startsAt))
    .limit(50);

  return NextResponse.json({ sessions: rows });
}

// ── POST /api/sessions ──

const postSchema = z.object({
  clientId: z.string().uuid(),
  consultantId: z.string().uuid(),
  title: z.string().max(200).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { clientId, consultantId, title, startsAt, endsAt, notes } = parsed.data;

  const [created] = await db
    .insert(sessions)
    .values({
      clientId,
      consultantId,
      title,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      notes,
    })
    .returning();

  return NextResponse.json({ session: created }, { status: 201 });
}

// ── PATCH /api/sessions (update status / reschedule) ──

const patchSchema = z.object({
  sessionId: z.string().uuid(),
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { sessionId, ...updates } = parsed.data;

  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (updates.status) values.status = updates.status;
  if (updates.startsAt) values.startsAt = new Date(updates.startsAt);
  if (updates.endsAt) values.endsAt = new Date(updates.endsAt);
  if (updates.notes !== undefined) values.notes = updates.notes;

  const [updated] = await db
    .update(sessions)
    .set(values)
    .where(eq(sessions.id, sessionId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ session: updated });
}
