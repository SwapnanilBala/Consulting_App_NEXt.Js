import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { apiRateLimit } from "@/lib/redis/rate-limit";

const schema = z.object({
  userId: z.string().uuid(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId } = parsed.data;

  const { success } = await apiRateLimit.limit(userId);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const [updated] = await db
    .update(posts)
    .set({ upvotes: sql`${posts.upvotes} + 1` })
    .where(eq(posts.id, params.postId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post: updated });
}
