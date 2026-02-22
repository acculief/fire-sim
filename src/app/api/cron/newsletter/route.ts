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

// Called by Vercel Cron: 1st of every month at 10:00 JST
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  try {
    const emails = (await redisCommand(["SMEMBERS", SUBSCRIBERS_KEY])) as string[];
    if (!emails || emails.length === 0) {
      return NextResponse.json({ sent: 0, message: "No subscribers" });
    }

    const resend = new Resend(resendKey);
    const now = new Date();
    const monthStr = `${now.getFullYear()}年${now.getMonth() + 1}月`;

    // Build newsletter HTML (TODO: add dynamic content later)
    const html = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #16a34a; font-size: 22px;">📊 ${monthStr}のFIRE進捗レポート</h1>
  <p>こんにちは。FIREシミュレーターからの月次レポートをお届けします。</p>

  <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <h2 style="font-size: 16px; margin: 0 0 8px;">💰 NISA枠チェック</h2>
    <p style="margin: 0;">年間投資枠360万円のうち、今月までの使用目安を確認しましょう。</p>
  </div>

  <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <h2 style="font-size: 16px; margin: 0 0 8px;">📈 積立継続のポイント</h2>
    <p style="margin: 0;">相場が揺れても積立継続が長期投資の基本。シミュレーションで目標を再確認しましょう。</p>
    <p style="margin: 8px 0 0;"><a href="https://fire-simulator.net/simulate/" style="color: #2563eb;">▶ シミュレーションを確認する</a></p>
  </div>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
  <p style="font-size: 12px; color: #9ca3af;">
    配信停止: <a href="https://fire-simulator.net/unsubscribe">こちら</a> | 
    <a href="https://fire-simulator.net">FIREシミュレーター</a>
  </p>
</div>
    `;

    // Send in batches of 50 (Resend free tier limit)
    let sent = 0;
    const batchSize = 50;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map((email) =>
          resend.emails.send({
            from: "FIREシミュレーター <noreply@fire-simulator.net>",
            to: email,
            subject: `【FIRE進捗レポート】${monthStr}号`,
            html,
          })
        )
      );
      sent += batch.length;
    }

    return NextResponse.json({ sent, total: emails.length });
  } catch (error) {
    console.error("Newsletter cron error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
