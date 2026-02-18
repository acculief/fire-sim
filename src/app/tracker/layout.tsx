import { Metadata } from "next";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "FIRE進捗トラッカー | 資産推移を記録して達成度を可視化",
  description:
    "毎月の金融資産を記録し、FIRE達成ラインまでの進捗をグラフで可視化。目標に向けた資産形成のモチベーションを維持できます。",
  openGraph: {
    title: "FIRE進捗トラッカー | 資産推移を記録して達成度を可視化",
    description:
      "毎月の資産を記録してFIRE達成度をグラフで可視化。モチベーション維持に。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FIRE進捗トラッカー",
  url: `${SITE_URL}/tracker/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description:
    "毎月の金融資産を記録し、FIRE達成ラインまでの進捗をグラフで可視化。",
};

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
