import { NextResponse } from "next/server";
import { getTwitterClient } from "@/lib/twitter";
import { generateTweet } from "@/lib/tweet-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Vercel Cronからの呼び出しを検証
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.error("Auth failed:", { hasSecret: !!cronSecret, authHeader });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = getTwitterClient();
    const text = generateTweet();
    const { data } = await client.v2.tweet(text);

    return NextResponse.json({
      success: true,
      tweetId: data.id,
      text,
    });
  } catch (error) {
    console.error("Tweet failed:", error);
    return NextResponse.json(
      { error: "Failed to post tweet", detail: String(error) },
      { status: 500 },
    );
  }
}
