import { Metadata } from "next";

export const metadata: Metadata = {
  title: "年収×年代別 FIREプラン | 家族構成・地域別シミュレーション",
  description:
    "年収300万〜1000万円、20代〜50代の年代別にFIRE達成に必要な資産額と達成年齢をシミュレーション。独身・夫婦・子あり家庭それぞれのプランを比較できます。",
  openGraph: {
    title: "年収×年代別 FIREプラン",
    description:
      "年収と年代の組み合わせ別にFIRE必要資産と達成年齢をシミュレーション",
  },
};

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
