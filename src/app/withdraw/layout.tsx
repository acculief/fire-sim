import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "取り崩しシミュレーション（無料）FIRE後の資産寿命を計算",
  description:
    "無料の取り崩しシミュレーター。FIRE達成後、4%ルールに基づいて資産が何歳まで持つかを計算。取り崩し率・インフレ率・運用利回りを考慮した現実的なシミュレーション。",
  alternates: { canonical: "/withdraw/" },
  openGraph: {
    title: "取り崩しシミュレーション（無料）FIRE後の資産寿命を計算",
    description:
      "FIRE達成後の資産取り崩しシミュレーション。4%ルールで何歳まで資産が持つかを無料で計算。",
    url: "/withdraw/",
    siteName: "FIREシミュレーター",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "取り崩しシミュレーション",
  url: `${SITE_URL}/withdraw/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description:
    "FIRE達成後の資産取り崩しシミュレーション。4%ルールで何歳まで資産が持つかを無料で計算。",
};

export default function WithdrawLayout({
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
