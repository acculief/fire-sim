import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "fire診断【無料】あなたのFIRE目標額・達成年齢を6問で判定",
  description:
    "fire診断・FIRE達成度診断（無料・登録不要）。年齢・年収・資産額など6問に答えるだけで、FIREナンバー・達成予測年齢・偏差値が即座にわかります。",
  alternates: { canonical: "/diagnose/" },
  openGraph: {
    title: "fire診断【無料】FIRE目標額・達成年齢を6問で判定",
    description:
      "fire診断・FIRE達成度診断（無料・登録不要）。6問に答えるだけでFIREナンバー・達成予測年齢・偏差値が即座にわかります。",
    url: "/diagnose/",
    siteName: "FIREシミュレーター",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "fire診断・FIRE達成度診断",
  url: `${SITE_URL}/diagnose/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description:
    "fire診断（無料）。6問に答えるだけでFIREナンバー・達成予測年齢・偏差値が即座にわかります。",
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
