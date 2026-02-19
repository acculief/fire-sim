import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FIREシミュレーション結果";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage({
  params,
  searchParams,
}: {
  params: Record<string, string>;
  searchParams: { pref?: string; fire?: string; age?: string; expense?: string };
}) {
  const pref = searchParams.pref ?? "";
  const fire = searchParams.fire ? Number(searchParams.fire) : null;
  const age = searchParams.age ? Number(searchParams.age) : null;
  const expense = searchParams.expense ? Number(searchParams.expense) : null;

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
        {/* Header */}
        <div
          style={{
            fontSize: 28,
            color: "#bfdbfe",
            marginBottom: 16,
          }}
        >
          FIREシミュレーション結果
        </div>

        {/* Main result */}
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
            <div style={{ fontSize: 24, color: "#93c5fd" }}>
              FIRE必要資産
            </div>
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

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 8,
          }}
        >
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

        {/* Footer branding */}
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
    { ...size },
  );
}
