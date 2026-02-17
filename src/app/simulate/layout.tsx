import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIREシミュレーション | 必要資産・達成年を計算",
  description:
    "あなたの地域・年収・家族構成に合わせてFIRE必要資産と達成年を計算。楽観・中立・悲観の3シナリオで比較し、感度分析も確認できます。",
  openGraph: {
    title: "FIREシミュレーション",
    description:
      "地域・年収・家族構成からFIRE必要資産と達成年をシミュレーション",
  },
};

export default function SimulateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
