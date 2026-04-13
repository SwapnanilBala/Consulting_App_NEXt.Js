import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { publishToChannel } from "@/lib/realtime/ably-server";
import { userChannel } from "@/lib/realtime/channels";

interface CreateNotificationInput {
  userId: string;
  type: "session_booked" | "session_cancelled" | "new_message" | "community_reply" | "community_upvote" | "system";
  title: string;
  body: string;
  href?: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput) {
  const [created] = await db
    .insert(notifications)
    .values({
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      href: input.href,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    })
    .returning();

  await publishToChannel(userChannel(input.userId), "notification:new", {
    id: created.id,
    type: created.type,
    title: created.title,
    body: created.body,
    href: input.href,
    isRead: false,
    createdAt: created.createdAt,
  });

  return created;
}
