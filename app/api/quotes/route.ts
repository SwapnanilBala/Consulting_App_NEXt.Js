import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { quotes } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// ── GET /api/quotes?category=Wellness ──

const getSchema = z.object({
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  random: z.enum(["true", "false"]).optional(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = getSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { category, limit = 20, random } = parsed.data;

  const conditions = category ? eq(quotes.category, category) : undefined;
  const orderBy = random === "true" ? sql`RANDOM()` : desc(quotes.createdAt);

  const rows = await db
    .select()
    .from(quotes)
    .where(conditions)
    .orderBy(orderBy)
    .limit(limit);

  return NextResponse.json({ quotes: rows });
}
