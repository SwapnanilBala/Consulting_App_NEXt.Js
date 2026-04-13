import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { postReplies, posts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { createNotification } from "@/lib/notifications/create";

// ── GET /api/community/[postId]/replies ──

export async function GET(
  _req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const rows = await db
    .select()
    .from(postReplies)
    .where(eq(postReplies.postId, params.postId))
    .orderBy(desc(postReplies.createdAt))
    .limit(100);

  return NextResponse.json({ replies: rows });
}

// ── POST /api/community/[postId]/replies ──

const replySchema = z.object({
  authorId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  isAnonymous: z.boolean().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const body = await req.json();
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { authorId, content, isAnonymous = false } = parsed.data;

  const [created] = await db
    .insert(postReplies)
    .values({
      postId: params.postId,
      authorId,
      content,
      isAnonymous,
    })
    .returning();

  // Notify the post author about the reply
  const [post] = await db
    .select({ authorId: posts.authorId })
    .from(posts)
    .where(eq(posts.id, params.postId))
    .limit(1);

  if (post && post.authorId !== authorId) {
    await createNotification({
      userId: post.authorId,
      type: "community_reply",
      title: "New Reply",
      body: content.length > 80 ? content.slice(0, 80) + "\u2026" : content,
      href: "/dashboard/community",
    });
  }

  return NextResponse.json({ reply: created }, { status: 201 });
}
