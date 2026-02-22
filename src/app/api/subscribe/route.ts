import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUBSCRIBERS_KEY = "fire_email_subscribers";

async function redisCommand(command: string[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Redis not configured");

  const res = await fetch(url, {
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

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
    }

    // Check duplicate (SISMEMBER)
    const exists = await redisCommand(["SISMEMBER", SUBSCRIBERS_KEY, email]);
    if (exists) {
      return NextResponse.json({ message: "すでに登録済みです！" });
    }

    // Save to Redis SET
    await redisCommand(["SADD", SUBSCRIBERS_KEY, email]);

    // Get total count
    const count = await redisCommand(["SCARD", SUBSCRIBERS_KEY]);

    // Send welcome email if Resend is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "FIREシミュレーター <onboarding@resend.dev>",
          to: email,
          subject: "【FIRE進捗レポート】登録ありがとうございます",
          html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #16a34a; font-size: 20px;">登録ありがとうございます！</h1>
  <p>FIREシミュレーターの月次レポートへの登録が完了しました。</p>
  <p><strong>毎月お届けする内容：</strong></p>
  <ul>
    <li>📊 積立ペース診断（あなたのFIRE達成率）</li>
    <li>💰 NISA年間枠の消化状況チェック</li>
    <li>📈 相場コメント＆積立継続のヒント</li>
  </ul>
  <p>次回の配信をお楽しみに。</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
  <p style="font-size: 12px; color: #9ca3af;">
    配信停止は <a href="https://fire-simulator.net/unsubscribe?email=${encodeURIComponent(email)}">こちら</a>
  </p>
</div>
          `,
        });
      } catch {
        // Welcome email failure is non-fatal
        console.error("Welcome email failed");
      }
    }

    return NextResponse.json({
      message: "登録しました！来月の配信をお楽しみに",
      count: Number(count),
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}

// Admin: get subscriber count (no email list for privacy)
export async function GET(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const count = await redisCommand(["SCARD", SUBSCRIBERS_KEY]);
    const members = await redisCommand(["SMEMBERS", SUBSCRIBERS_KEY]);
    return NextResponse.json({ count, members });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
