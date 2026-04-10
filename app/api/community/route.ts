import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { publishToChannel } from "@/lib/realtime/ably-server";
import { communityChannel } from "@/lib/realtime/channels";
import { apiRateLimit } from "@/lib/redis/rate-limit";
import { eq, desc, sql } from "drizzle-orm";

// ── GET /api/community?group=Mindfulness ──

const getSchema = z.object({
  group: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = getSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { group, limit = 30 } = parsed.data;

  const conditions = group ? eq(posts.group, group) : undefined;

  // Fetch posts with reply counts
  const rows = await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      content: posts.content,
      isAnonymous: posts.isAnonymous,
      group: posts.group,
      upvotes: posts.upvotes,
      createdAt: posts.createdAt,
      replyCount: sql<number>`(SELECT count(*) FROM post_replies WHERE post_replies.post_id = ${posts.id})`,
    })
    .from(posts)
    .where(conditions)
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  return NextResponse.json({ posts: rows });
}

// ── POST /api/community ──

const postSchema = z.object({
  authorId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  isAnonymous: z.boolean().optional(),
  group: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { authorId, content, isAnonymous = false, group = "General" } = parsed.data;

  // Rate limit
  const { success } = await apiRateLimit.limit(authorId);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const [created] = await db
    .insert(posts)
    .values({ authorId, content, isAnonymous, group })
    .returning();

  // Publish to community channel
  await publishToChannel(communityChannel(group), "post:new", {
    id: created.id,
    authorId: isAnonymous ? null : created.authorId,
    content: created.content,
    isAnonymous: created.isAnonymous,
    group: created.group,
    upvotes: created.upvotes,
    createdAt: created.createdAt,
  });

  return NextResponse.json({ post: created }, { status: 201 });
}
