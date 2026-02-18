import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "取り崩しシミュレーション | FIREシミュレーター",
  description:
    "FIRE達成後、資産を取り崩しながら何歳まで資産が持つかをシミュレーション。取り崩し率・インフレ率・運用利回りを考慮した現実的な計算。",
  openGraph: {
    title: "取り崩しシミュレーション | FIREシミュレーター",
    description:
      "FIRE達成後の資産取り崩しシミュレーション。何歳まで資産が持つかを計算。",
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
    "FIRE達成後の資産取り崩しシミュレーション。何歳まで資産が持つかを計算。",
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
