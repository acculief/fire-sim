import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FIREシミュレーター | 地域別・年収別で達成年を計算";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          FIRE シミュレーター
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#bfdbfe",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          地域・年収・家族構成から FIRE達成年を計算
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 48,
          }}
        >
          {["47都道府県対応", "3シナリオ比較", "無料"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#ffffff",
                padding: "10px 24px",
                borderRadius: 999,
                fontSize: 24,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
