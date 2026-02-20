import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FIRE達成度診断 | あなたはFIREまであと何年？",
  description:
    "6つの質問であなたのFIRE達成度をパーソナライズ診断。年齢・家族構成・年収・貯蓄額・資産額・投資経験からFIRE目標額と達成年齢を判定します。",
  alternates: { canonical: "/diagnose/" },
  openGraph: {
    title: "FIRE達成度診断 | あなたはFIREまであと何年？",
    description:
      "6つの質問であなたのFIRE達成度をパーソナライズ診断。年齢・家族構成・年収・貯蓄額・資産額・投資経験からFIRE目標額と達成年齢を判定します。",
    url: "/diagnose/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FIRE達成度診断",
  url: `${SITE_URL}/diagnose/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description:
    "6問でFIRE達成度をパーソナライズ診断。家族構成・年収を含めた目標額と達成年齢を判定。",
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
