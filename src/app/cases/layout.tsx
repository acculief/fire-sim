import { Metadata } from "next";

export const metadata: Metadata = {
  title: "年代別FIREモデルケース | 条件別シミュレーション事例",
  description:
    "30代独身・40代子あり・50代夫婦など、年代・家族構成・地域別のFIREモデルケースを紹介。必要資産額や達成年齢をシミュレーションで解説します。",
  alternates: { canonical: "/cases/" },
  openGraph: {
    title: "年代別FIREモデルケース",
    description:
      "年代・家族構成・地域別のFIREモデルケースと必要資産シミュレーション",
  },
};

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
