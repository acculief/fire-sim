import { ImageResponse } from "next/og";
import { getPrefectureByCode } from "@/data/prefectures";

export const runtime = "edge";
export const alt = "FIREシミュレーション";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ pref: string }>;
}) {
  const { pref } = await params;
  const prefecture = getPrefectureByCode(pref);
  const name = prefecture?.name ?? pref;
  const costIndex = prefecture?.costIndex ?? 1.0;

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
            fontSize: 36,
            color: "#bfdbfe",
          }}
        >
          FIREシミュレーター
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          {name}のFIRE必要資産
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(255,255,255,0.15)",
              padding: "20px 40px",
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 22, color: "#bfdbfe" }}>生活費係数</div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#ffffff" }}>
              {costIndex}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(255,255,255,0.15)",
              padding: "20px 40px",
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 22, color: "#bfdbfe" }}>全国平均比</div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#ffffff" }}>
              {costIndex >= 1.0 ? "+" : ""}
              {Math.round((costIndex - 1.0) * 100)}%
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
