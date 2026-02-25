import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FIRE診断（無料）6問であなたの達成度を判定",
  description:
    "無料・登録不要のFIRE診断。年齢・年収・資産額など6問に答えるだけで、あなたのFIRE目標額・達成予測年齢・FIREグレード（A〜D）が分かります。",
  alternates: { canonical: "/diagnose/" },
  openGraph: {
    title: "FIRE診断（無料）6問であなたの達成度を判定",
    description:
      "無料・登録不要のFIRE診断。年齢・年収・資産額など6問に答えるだけで、あなたのFIRE目標額・達成予測年齢・FIREグレードが分かります。",
    url: "/diagnose/",
    siteName: "FIREシミュレーター",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FIRE診断",
  url: `${SITE_URL}/diagnose/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description:
    "無料のFIRE診断。6問に答えるだけでFIRE目標額・達成予測年齢・FIREグレードが分かります。",
};

export default function DiagnoseLayout({
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
