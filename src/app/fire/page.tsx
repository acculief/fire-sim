import { Metadata } from "next";
import Link from "next/link";
import { prefectures } from "@/data/prefectures";
import { REGION_SLUGS } from "@/config/assumptions";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RelatedContent from "@/components/RelatedContent";

export const metadata: Metadata = {
  title: "地域別FIREシミュレーション | 47都道府県対応",
  description:
    "47都道府県の生活費係数に基づくFIRE必要資産シミュレーション。お住まいの地域を選んで、FIRE達成に必要な資産と年数を計算できます。",
  openGraph: {
    title: "地域別FIREシミュレーション",
    description: "47都道府県対応。地域の生活費に基づくFIRE必要資産を計算",
  },
};

export default function FireIndexPage() {
  const regions = Array.from(new Set(prefectures.map((p) => p.region)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "地域別" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        地域別FIREシミュレーション
      </h1>
      <p className="mt-2 text-gray-600">
        47都道府県それぞれの生活費係数を反映したFIREシミュレーション。
        お住まいの地域を選択してください。
      </p>

      <div className="mt-8 space-y-8">
        {regions.map((region) => {
          const regionPrefs = prefectures.filter((p) => p.region === region);
          return (
            <section key={region}>
              <h2 className="mb-3 text-lg font-bold text-gray-800">
                {region}
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {regionPrefs.map((p) => (
                  <Link
                    key={p.code}
                    href={`/fire/${p.code}/`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    <span className="font-medium text-gray-800">{p.name}</span>
                    <span className="text-sm text-gray-500">
                      係数 {p.costIndex}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* 地方別比較リンク */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-800">地方別のFIRE比較</h2>
        <p className="mt-1 text-sm text-gray-500">
          地方ごとの都道府県を比較して、FIREに有利な地域を見つけましょう
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {REGION_SLUGS.map((r) => (
            <Link
              key={r.slug}
              href={`/fire/region/${r.slug}/`}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-center font-medium text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </section>

      <RelatedContent
        items={[
          { href: "/guide/fire-by-region/", title: "地域別FIRE戦略", description: "地方移住とFIREの関係を解説" },
          { href: "/guide/side-fire/", title: "サイドFIREとは", description: "完全リタイアではない柔軟なFIRE" },
          { href: "/cases/", title: "モデルケース", description: "年代別のFIRE達成プランを参考に" },
          { href: "/income/", title: "手取り早見表", description: "年収別の手取り額・税金を確認" },
        ]}
      />

      {/* CTA */}
      <div className="mt-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          地域を選ばず今すぐ計算する
        </p>
        <Link
          href="/simulate/"
          className="btn-primary mt-4 inline-block text-lg"
        >
          シミュレーション開始
        </Link>
      </div>

      {/* 構造化データ */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "地域別FIREシミュレーション",
          description: "47都道府県の生活費に基づくFIRE必要資産シミュレーション",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: prefectures.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `/fire/${p.code}/`,
              name: `${p.name}のFIREシミュレーション`,
            })),
          },
        }}
      />
    </div>
  );
}
