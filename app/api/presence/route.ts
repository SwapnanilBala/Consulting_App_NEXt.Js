import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setOnline, setOffline, getOnlineUsers, isOnline } from "@/lib/redis/presence";

// ── GET /api/presence?userId=xxx ──
// If userId provided, check single user. Otherwise return all online.

const getSchema = z.object({
  userId: z.string().uuid().optional(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = getSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.userId) {
    const online = await isOnline(parsed.data.userId);
    return NextResponse.json({ userId: parsed.data.userId, online });
  }

  const users = await getOnlineUsers();
  return NextResponse.json({ online: users });
}

// ── POST /api/presence (heartbeat / go online) ──

const postSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum(["online", "offline"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, action } = parsed.data;

  if (action === "online") {
    await setOnline(userId);
  } else {
    await setOffline(userId);
  }

  return NextResponse.json({ ok: true });
}
