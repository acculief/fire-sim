import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FIREシミュレーション（無料）必要資産と達成年を計算",
  description:
    "無料のFIREシミュレーター。47都道府県の生活費・年収・家族構成を入力して必要資産と達成年を計算。3シナリオ比較＆感度分析で現実的なFIRE計画が立てられます。",
  alternates: { canonical: "/simulate/" },
  openGraph: {
    title: "FIREシミュレーション（無料）必要資産と達成年を計算",
    description:
      "47都道府県対応。年収・家族構成・居住地域からFIRE必要資産と達成年をシミュレーション。3シナリオ比較＆感度分析対応。",
    url: "/simulate/",
    siteName: "FIREシミュレーター",
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
    "47都道府県対応の無料FIREシミュレーター。年収・家族構成・居住地域からFIRE必要資産と達成年を計算。3シナリオ比較・感度分析対応。",
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
