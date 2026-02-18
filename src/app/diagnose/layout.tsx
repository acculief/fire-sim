import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FIRE達成度診断 | あなたはFIREまであと何年？",
  description:
    "たった3問であなたのFIRE達成度を診断。年齢・貯蓄額・資産額からFIRE達成年齢とランクを判定します。",
  alternates: { canonical: "/diagnose/" },
  openGraph: {
    title: "FIRE達成度診断 | あなたはFIREまであと何年？",
    description:
      "たった3問であなたのFIRE達成度を診断。年齢・貯蓄額・資産額からFIRE達成年齢とランクを判定します。",
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
    "3問でFIRE達成度を診断。年齢・貯蓄額・資産額からランクを判定。",
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
