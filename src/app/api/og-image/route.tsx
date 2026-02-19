import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const pref = searchParams.get("pref") ?? "";
  const fire = searchParams.get("fire") ? Number(searchParams.get("fire")) : null;
  const age = searchParams.get("age") ? Number(searchParams.get("age")) : null;
  const expense = searchParams.get("expense") ? Number(searchParams.get("expense")) : null;
  const strategy = searchParams.get("strategy") ?? "";
  const family = searchParams.get("family") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 60px",
        }}
      >
        <div style={{ fontSize: 28, color: "#bfdbfe", marginBottom: 16 }}>
          FIREシミュレーション結果
        </div>

        {fire !== null && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(255,255,255,0.12)",
              borderRadius: 24,
              padding: "32px 64px",
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 24, color: "#93c5fd" }}>FIRE必要資産</div>
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.1,
                marginTop: 8,
              }}
            >
              {fire.toLocaleString()}
              <span style={{ fontSize: 36, fontWeight: 700 }}>万円</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 40, marginTop: 8 }}>
          {pref && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.1)",
                padding: "16px 32px",
                borderRadius: 16,
              }}
            >
              <div style={{ fontSize: 18, color: "#93c5fd" }}>居住地</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#ffffff", marginTop: 4 }}>
                {pref}
              </div>
            </div>
          )}
          {age !== null && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.1)",
                padding: "16px 32px",
                borderRadius: 16,
              }}
            >
              <div style={{ fontSize: 18, color: "#93c5fd" }}>達成年齢</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#ffffff", marginTop: 4 }}>
                {age}歳
              </div>
            </div>
          )}
          {expense !== null && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.1)",
                padding: "16px 32px",
                borderRadius: 16,
              }}
            >
              <div style={{ fontSize: 18, color: "#93c5fd" }}>月間生活費</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#ffffff", marginTop: 4 }}>
                {expense}万円
              </div>
            </div>
          )}
        </div>

        {(family || strategy) && (
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {family && (
              <div
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                  background: "rgba(255,255,255,0.08)",
                  padding: "8px 20px",
                  borderRadius: 12,
                }}
              >
                {family}
              </div>
            )}
            {strategy && (
              <div
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                  background: "rgba(255,255,255,0.08)",
                  padding: "8px 20px",
                  borderRadius: 12,
                }}
              >
                {strategy === "yield" ? "利回り運用" : "取り崩し"}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          fire-simulator.net
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
