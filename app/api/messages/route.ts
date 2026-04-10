import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { messages, conversations, conversationMembers } from "@/lib/db/schema";
import { publishToChannel } from "@/lib/realtime/ably-server";
import { conversationChannel } from "@/lib/realtime/channels";
import { messageRateLimit } from "@/lib/redis/rate-limit";
import { eq, desc, and } from "drizzle-orm";

// ── GET /api/messages?conversationId=xxx ──

const getSchema = z.object({
  conversationId: z.string().uuid(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = getSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { conversationId } = parsed.data;

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(50);

  return NextResponse.json({ messages: rows });
}

// ── POST /api/messages ──
// Pipeline: validate → rate-limit → save to NeonDB → publish to Ably

const postSchema = z.object({
  conversationId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { conversationId, senderId, content } = parsed.data;

  // Rate limit check
  const { success, remaining } = await messageRateLimit.limit(senderId);
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again shortly." },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  // Verify sender is a member of the conversation
  const membership = await db
    .select()
    .from(conversationMembers)
    .where(
      and(
        eq(conversationMembers.conversationId, conversationId),
        eq(conversationMembers.userId, senderId)
      )
    )
    .limit(1);

  if (membership.length === 0) {
    return NextResponse.json(
      { error: "Not a member of this conversation" },
      { status: 403 }
    );
  }

  // 1. Save to NeonDB (source of truth)
  const [saved] = await db
    .insert(messages)
    .values({ conversationId, senderId, content })
    .returning();

  // 2. Update conversation timestamp
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  // 3. Publish to Ably channel (real-time pipe)
  await publishToChannel(
    conversationChannel(conversationId),
    "message:new",
    {
      id: saved.id,
      conversationId: saved.conversationId,
      senderId: saved.senderId,
      content: saved.content,
      createdAt: saved.createdAt,
    }
  );

  return NextResponse.json({ message: saved }, { status: 201 });
}
