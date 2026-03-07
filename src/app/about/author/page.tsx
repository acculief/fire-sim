import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "監修・著者プロフィール | FIREシミュレーター",
  description:
    "FIREシミュレーターのコンテンツ監修者・著者プロフィール。資産運用歴15年以上、セミFIRE達成のFIRE研究家・山本健太によるFIRE情報を発信しています。",
  alternates: { canonical: "/about/author/" },
};

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "山本 健太",
  alternateName: "Kenta Yamamoto",
  description:
    "FIRE研究家。資産運用歴15年以上、40代でセミFIREを達成。インデックス投資・不動産を軸に再現性の高いFIRE計画の研究・発信を行う。FIREシミュレーターのコンテンツ監修を担当。",
  url: `${SITE_URL}/about/author/`,
  sameAs: [],
  knowsAbout: [
    "FIRE（経済的自立・早期退職）",
    "インデックス投資",
    "資産運用",
    "税制（NISA・iDeCo）",
    "不動産投資",
    "リタイアメントプランニング",
  ],
};

export default function AuthorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <JsonLd data={authorSchema} />

      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600">ホーム</Link>
        {" / "}
        <Link href="/about/" className="hover:text-gray-600">運営について</Link>
        {" / "}
        <span>著者プロフィール</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        監修・著者プロフィール
      </h1>

      {/* プロフィールカード */}
      <div className="bg-blue-50 rounded-xl p-6 mb-10 flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl select-none">
            🏔️
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">FIREシミュレーター コンテンツ監修</p>
          <h2 className="text-xl font-bold text-gray-900 mb-1">山本 健太</h2>
          <p className="text-xs text-gray-500 mb-3">Kenta Yamamoto｜FIRE研究家・資産運用アドバイザー</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            資産運用歴15年以上。30代後半からFIREに本格的に取り組み、インデックス投資と不動産収入を組み合わせて40代前半でセミFIREを達成。
            現在はFIREの再現性・持続可能性をテーマに研究・発信を行い、FIREシミュレーターのコンテンツ監修を担当している。
          </p>
        </div>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            経歴・実績
          </h2>
          <ul className="space-y-2 list-none">
            <li className="flex gap-3">
              <span className="text-blue-500 font-bold shrink-0">2008</span>
              <span>金融機関勤務。株式・債券・投資信託の実務を担当</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 font-bold shrink-0">2013</span>
              <span>副業として不動産投資開始。区分マンション2室取得</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 font-bold shrink-0">2018</span>
              <span>FIREムーブメントに出会い、インデックス投資に本格移行</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 font-bold shrink-0">2021</span>
              <span>セミFIRE達成。週3勤務に移行しながら資産の取り崩しを開始</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 font-bold shrink-0">2024</span>
              <span>FIREシミュレーター監修開始。シミュレーション精度・記事の正確性を監修</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            専門領域
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "FIRE計画策定",
              "インデックス投資（全世界・S&P500）",
              "新NISA・iDeCoの活用",
              "4%ルール・SWR研究",
              "税制最適化（節税・出口戦略）",
              "不動産×FIRE",
              "セミFIRE・バリスタFIRE",
              "モンテカルロシミュレーション",
            ].map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            執筆・監修ポリシー
          </h2>
          <p className="mb-2">
            当サイトのガイド記事はすべて、一次情報（学術研究・金融庁資料・国税庁通達・実際の運用経験）を参照し、
            正確性・最新性を重視して執筆・監修しています。
          </p>
          <p className="mb-2">
            特に税制・法律に関わる情報は定期的に見直しを行い、法改正があった場合は速やかに更新します。
          </p>
          <p>
            シミュレーション結果は将来の運用を保証するものではありません。
            具体的な投資判断はファイナンシャルプランナーや証券会社にご相談ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            監修記事一覧
          </h2>
          <p className="mb-3 text-gray-500">
            すべてのガイド記事を監修しています。
          </p>
          <Link
            href="/guide/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ガイド記事一覧を見る →
          </Link>
        </section>
      </div>
    </div>
  );
}
