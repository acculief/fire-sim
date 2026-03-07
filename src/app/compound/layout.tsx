import { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "投資信託 複利計算シミュレーション【無料】積立投資の将来額を計算",
  description:
    "投資・投資信託の複利計算シミュレーター（無料）。毎月の積立額・利回り・運用期間を入力するだけで将来の資産額を自動計算。投資シミュレーションとして元本・運用益の内訳もグラフ表示。",
  alternates: { canonical: "/compound/" },
  openGraph: {
    title: "投資信託 複利計算シミュレーション【無料】積立投資の将来額を計算",
    description:
      "毎月の積立額と利回りから将来の資産額を複利計算。元本・運用益の内訳をグラフ表示。FIRE計画にも活用できます。",
    url: "/compound/",
    siteName: "FIREシミュレーター",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "複利計算シミュレーション",
  url: `${SITE_URL}/compound/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description:
    "無料の複利計算シミュレーター。積立投資の将来額を計算し、元本と運用益の内訳をグラフで表示します。",
};

export default function CompoundLayout({
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
