import { NextRequest, NextResponse } from "next/server";
import { createTokenRequest } from "@/lib/realtime/ably-server";

/**
 * POST /api/realtime/token
 * Client calls this to get an Ably token for authenticated real-time connections.
 * In production, validate the user's session before issuing a token.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const clientId = body.clientId;

  if (!clientId || typeof clientId !== "string") {
    return NextResponse.json(
      { error: "clientId is required" },
      { status: 400 }
    );
  }

  // TODO: In production, verify the user's auth session here
  // to ensure they can only request tokens for their own clientId.

  const tokenRequest = await createTokenRequest(clientId);
  return NextResponse.json(tokenRequest);
}
