import { NextResponse } from "next/server";

const COUNTER_KEY = "simulation_count";
const INITIAL_COUNT = 32150;

async function redisCommand(command: string[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  return data.result;
}

export async function GET() {
  try {
    const count = await redisCommand(["GET", COUNTER_KEY]);
    return NextResponse.json({ count: count ? Number(count) : INITIAL_COUNT });
  } catch {
    return NextResponse.json({ count: INITIAL_COUNT });
  }
}

export async function POST() {
  try {
    // キーが未設定なら初期値セット
    const exists = await redisCommand(["EXISTS", COUNTER_KEY]);
    if (!exists) {
      await redisCommand(["SET", COUNTER_KEY, String(INITIAL_COUNT)]);
    }
    const count = await redisCommand(["INCR", COUNTER_KEY]);
    return NextResponse.json({ count: count ? Number(count) : INITIAL_COUNT });
  } catch {
    return NextResponse.json({ count: INITIAL_COUNT });
  }
}
