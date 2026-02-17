import { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/data/guides";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "FIREガイド | 経済的自立・早期退職の完全ガイド",
  description:
    "FIRE（経済的自立・早期退職）に関する包括的なガイド記事。4%ルール、必要資産の計算方法、地域別戦略、税制活用法などを解説。",
};

export default function GuidesIndexPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "FIREガイド",
    description:
      "FIRE（経済的自立・早期退職）に関する包括的なガイド記事集",
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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

      <div className="mt-8 space-y-4">
        {guides.map((article) => (
          <Link
            key={article.slug}
            href={`/guide/${article.slug}/`}
            className="block rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <h2 className="text-lg font-bold text-gray-800">
              {article.title}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {article.description}
            </p>
            <time className="mt-2 block text-xs text-gray-400">
              {article.publishedAt}
            </time>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/simulate/" className="btn-primary inline-block text-lg">
          シミュレーションを試す
        </Link>
      </div>
    </div>
  );
}
