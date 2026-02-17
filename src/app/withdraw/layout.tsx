import { Metadata } from "next";

export const metadata: Metadata = {
  title: "取り崩しシミュレーション | FIREシミュレーター",
  description:
    "FIRE達成後、資産を取り崩しながら何歳まで資産が持つかをシミュレーション。取り崩し率・インフレ率・運用利回りを考慮した現実的な計算。",
};

export default function WithdrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
