/**
 * Channel naming conventions for Ably pub/sub.
 * Keeps channel names consistent across server + client.
 */

/** Private conversation channel — only members should subscribe */
export function conversationChannel(conversationId: string): string {
  return `conversation:${conversationId}`;
}

/** User-specific channel for notifications, presence updates, etc. */
export function userChannel(userId: string): string {
  return `user:${userId}`;
}

/** Community group channel for new posts / updates */
export function communityChannel(group: string): string {
  return `community:${group}`;
}

/** Global presence channel */
export const PRESENCE_CHANNEL = "presence:global";
