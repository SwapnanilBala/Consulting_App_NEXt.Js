import Ably from "ably";

let _client: Ably.Rest | null = null;

/**
 * Server-side Ably REST client (singleton).
 * Used in API routes to publish messages to channels.
 */
export function getAblyServer(): Ably.Rest {
  if (!_client) {
    _client = new Ably.Rest({ key: process.env.ABLY_API_KEY! });
  }
  return _client;
}

/**
 * Publish an event to an Ably channel from the server.
 */
export async function publishToChannel(
  channelName: string,
  eventName: string,
  data: unknown
): Promise<void> {
  const client = getAblyServer();
  const channel = client.channels.get(channelName);
  await channel.publish(eventName, data);
}

/**
 * Create a token request for client-side Ably authentication.
 * The client calls this via API route, then uses the token to connect.
 */
export async function createTokenRequest(
  clientId: string
): Promise<Ably.TokenRequest> {
  const client = getAblyServer();
  return client.auth.createTokenRequest({ clientId });
}
