import { NextRequest, NextResponse } from "next/server";

const SUBSCRIBERS_KEY = "fire_email_subscribers";

async function redisCommand(command: string[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Redis not configured");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  return data.result;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 },
      );
    }
    await redisCommand(["SREM", SUBSCRIBERS_KEY, email]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました。もう一度お試しください" },
      { status: 500 },
    );
  }
}
