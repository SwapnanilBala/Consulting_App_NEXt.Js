import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { conversations, conversationMembers, messages, users } from "@/lib/db/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";

// ── GET /api/conversations?userId=xxx ──

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

  // Get conversation IDs this user belongs to
  const memberships = await db
    .select({ conversationId: conversationMembers.conversationId })
    .from(conversationMembers)
    .where(eq(conversationMembers.userId, userId));

  if (memberships.length === 0) {
    return NextResponse.json({ conversations: [] });
  }

  const conversationIds = memberships.map((m) => m.conversationId);

  // Get conversations with members and latest message
  const rows = await db
    .select()
    .from(conversations)
    .where(inArray(conversations.id, conversationIds))
    .orderBy(desc(conversations.updatedAt));

  // For each conversation, get members and latest message
  const result = await Promise.all(
    rows.map(async (conv) => {
      const members = await db
        .select({
          userId: conversationMembers.userId,
          userName: users.name,
          userAvatar: users.avatarUrl,
        })
        .from(conversationMembers)
        .innerJoin(users, eq(users.id, conversationMembers.userId))
        .where(eq(conversationMembers.conversationId, conv.id));

      const [latestMessage] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      return {
        ...conv,
        members,
        lastMessage: latestMessage ?? null,
      };
    })
  );

  return NextResponse.json({ conversations: result });
}

// ── POST /api/conversations ──

const postSchema = z.object({
  memberIds: z.array(z.string().uuid()).min(2).max(10),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { memberIds } = parsed.data;
  const sorted = [...memberIds].sort();

  // Check for existing conversation with exactly these members (for 1:1)
  if (sorted.length === 2) {
    const existing = await db.execute(sql`
      SELECT cm.conversation_id
      FROM conversation_members cm
      WHERE cm.conversation_id IN (
        SELECT conversation_id FROM conversation_members
        WHERE user_id = ${sorted[0]}
        INTERSECT
        SELECT conversation_id FROM conversation_members
        WHERE user_id = ${sorted[1]}
      )
      GROUP BY cm.conversation_id
      HAVING COUNT(*) = 2
      LIMIT 1
    `);

    if (existing.rows.length > 0) {
      const convId = existing.rows[0].conversation_id as string;
      const [conv] = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, convId))
        .limit(1);
      return NextResponse.json({ conversation: conv, existing: true });
    }
  }

  // Create new conversation
  const [conv] = await db.insert(conversations).values({}).returning();

  // Add members
  await db.insert(conversationMembers).values(
    sorted.map((userId) => ({
      conversationId: conv.id,
      userId,
    }))
  );

  return NextResponse.json({ conversation: conv, existing: false }, { status: 201 });
}
