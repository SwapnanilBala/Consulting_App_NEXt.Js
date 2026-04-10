"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Ably from "ably";

let _realtimeClient: Ably.Realtime | null = null;

function getRealtimeClient(clientId: string): Ably.Realtime {
  if (!_realtimeClient) {
    _realtimeClient = new Ably.Realtime({
      authUrl: "/api/realtime/token",
      authMethod: "POST",
      authParams: { clientId },
      clientId,
    });
  }
  return _realtimeClient;
}

/**
 * Subscribe to an Ably channel from a React component.
 * Messages arrive via the onMessage callback.
 */
export function useChannel(
  channelName: string,
  eventName: string,
  clientId: string,
  onMessage: (message: Ably.Message) => void
) {
  const callbackRef = useRef(onMessage);
  callbackRef.current = onMessage;

  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);

  useEffect(() => {
    const client = getRealtimeClient(clientId);
    const ch = client.channels.get(channelName);
    setChannel(ch);

    const listener = (msg: Ably.Message) => callbackRef.current(msg);
    ch.subscribe(eventName, listener);

    return () => {
      ch.unsubscribe(eventName, listener);
    };
  }, [channelName, eventName, clientId]);

  const publish = useCallback(
    async (data: unknown) => {
      if (!channel) return;
      await channel.publish(eventName, data);
    },
    [channel, eventName]
  );

  return { channel, publish };
}
