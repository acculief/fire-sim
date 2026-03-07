import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { guides } from "@/data/guides";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RelatedContent from "@/components/RelatedContent";

export const metadata: Metadata = {
  title: "FIREガイド51本 | 4%ルール・必要資産・節税・地域別シミュレーション",
  description:
    "FIREを目指す人向けガイド記事51本。4%ルール・必要資産の計算・節税・地域別シミュレーション・バリスタFIREまで完全網羅。今すぐ読む！",
  alternates: { canonical: "/guide/" },
  openGraph: {
    title: "FIREガイド51本 | 4%ルール・必要資産・節税・地域別シミュレーション",
    description:
      "FIREを目指す人向けガイド記事51本。4%ルール・必要資産・節税・地域別シミュレーション・バリスタFIREまで完全網羅。",
    type: "website",
    url: "/guide/",
    siteName: "FIREシミュレーター",
  },
};

export default function GuidesIndexPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "FIREガイド",
    description: "FIRE（経済的自立・早期退職）に関する包括的なガイド記事集",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((article, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/guide/${article.slug}/`,
        name: article.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <JsonLd data={structuredData} />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        FIREガイド
      </h1>
      <p className="mt-2 text-gray-600">
        FIRE（経済的自立・早期退職）を目指す方のための基礎知識から実践的な戦略まで
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((article) => (
          <Link
            key={article.slug}
            href={`/guide/${article.slug}/`}
            className="group flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-primary-300"
          >
            {article.heroImage ? (
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <Image
                  src={article.heroImage.src}
                  alt={article.heroImage.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="h-44 w-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
            )}
            <div className="flex flex-col flex-1 p-4">
              <h2 className="text-base font-bold text-gray-800 leading-snug group-hover:text-primary-700 transition-colors">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">
                {article.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <time>{article.updatedAt ?? article.publishedAt}</time>
                <span className="text-primary-600 font-medium">山本 健太 監修</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <RelatedContent
        items={[
          { href: "/simulate/", title: "FIREシミュレーション", description: "条件に合わせて必要資産を計算" },
          { href: "/diagnose/", title: "FIRE達成度診断", description: "6つの質問でFIREグレードを判定" },
          { href: "/compound/", title: "複利計算シミュレーション", description: "積立投資の将来額を複利で計算" },
          { href: "/cases/", title: "モデルケース", description: "年代別のFIRE達成プランを参考に" },
        ]}
      />

      <div className="mt-12 text-center">
        <Link href="/simulate/" className="btn-primary inline-block text-lg">
          シミュレーションを試す
        </Link>
      </div>
    </div>
  );
}
