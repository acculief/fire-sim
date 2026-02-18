import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FIREシミュレーション",
  url: `${SITE_URL}/simulate/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description:
    "地域・年収・家族構成からFIRE必要資産と達成年をシミュレーション。3シナリオ比較・感度分析対応。",
};

export default function SimulateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
