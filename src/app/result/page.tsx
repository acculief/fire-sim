import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/config/site";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedContent from "@/components/RelatedContent";

interface Props {
  searchParams: Promise<{
    pref?: string;
    fire?: string;
    age?: string;
    expense?: string;
    strategy?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const pref = params.pref ?? "";
  const fire = params.fire ? Number(params.fire) : null;
  const age = params.age ? Number(params.age) : null;

  const title = fire
    ? `FIRE必要資産 ${fire.toLocaleString()}万円${age ? ` / ${age}歳で達成` : ""}`
    : "FIREシミュレーション結果";

  const description = pref
    ? `${pref}在住の場合、FIRE達成に必要な資産は${fire?.toLocaleString() ?? "?"}万円。${age ? `${age}歳で経済的自立を達成できる見込みです。` : ""}`
    : `FIRE達成に必要な資産は${fire?.toLocaleString() ?? "?"}万円です。`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const pref = params.pref ?? "";
  const fire = params.fire ? Number(params.fire) : null;
  const age = params.age ? Number(params.age) : null;
  const expense = params.expense ? Number(params.expense) : null;
  const strategy = params.strategy === "yield" ? "配当金戦略" : "取り崩し戦略";

  const pageUrl = `${SITE_URL}/result/?pref=${encodeURIComponent(pref)}&fire=${fire ?? ""}&age=${age ?? ""}&expense=${expense ?? ""}`;

  const shareText = fire
    ? `私のFIRE必要資産は${fire.toLocaleString()}万円${age ? `（${age}歳で達成予定）` : ""}！あなたもシミュレーションしてみよう`
    : "FIREシミュレーションで自分の必要資産を計算しよう";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "シミュレーション", href: "/simulate/" },
          { label: "結果" },
        ]}
      />

      {/* 結果カード */}
      <div className="overflow-hidden rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-blue-50 shadow-lg">
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 px-6 py-4">
          <p className="text-center text-sm font-medium text-primary-100">
            FIREシミュレーション結果
          </p>
        </div>
        <div className="p-6 sm:p-8">
          {pref && (
            <p className="mb-1 text-center text-sm text-gray-500">
              {pref}在住 / {strategy}
            </p>
          )}

          {fire !== null && (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">FIRE必要資産</p>
              <p className="mt-1 text-4xl font-black text-primary-700 sm:text-5xl">
                {fire.toLocaleString()}
                <span className="text-xl font-bold text-primary-500">万円</span>
              </p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4">
            {age !== null && (
              <div className="rounded-xl bg-white/70 p-4 text-center">
                <p className="text-xs text-gray-500">達成予測年齢</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {age}
                  <span className="text-sm text-gray-500">歳</span>
                </p>
              </div>
            )}
            {expense !== null && (
              <div className="rounded-xl bg-white/70 p-4 text-center">
                <p className="text-xs text-gray-500">月間生活費</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {expense}
                  <span className="text-sm text-gray-500">万円</span>
                </p>
              </div>
            )}
          </div>

          {fire === null && (
            <div className="py-8 text-center">
              <p className="text-lg font-bold text-gray-700">
                シミュレーション結果を表示するには
              </p>
              <p className="mt-2 text-sm text-gray-500">
                まずはシミュレーションを実行して、結果を共有しましょう
              </p>
            </div>
          )}
        </div>
      </div>

      {/* シェアボタン */}
      <div className="mt-8">
        <p className="mb-3 text-center text-sm font-medium text-gray-600">
          結果をシェアする
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Xでポスト"
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            ポスト
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LINEでシェア"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#06C755] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            LINE
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebookでシェア"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            シェア
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-xl border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          あなたもFIREシミュレーションしてみませんか？
        </p>
        <p className="mt-1 text-sm text-primary-700">
          地域・年収・家族構成から、必要資産と達成年齢を計算できます
        </p>
        <Link href="/simulate/" className="btn-primary mt-4 inline-block">
          シミュレーションを始める
        </Link>
      </div>

      <RelatedContent
        heading="次のステップ"
        items={[
          { href: "/tracker/", title: "FIRE進捗トラッカー", description: "毎月の資産を記録してFIRE達成度を可視化" },
          { href: "/withdraw/", title: "取り崩しシミュレーション", description: "FIRE後に資産が何歳まで持つか計算" },
          { href: "/income/", title: "手取り早見表", description: "年収別の手取り額・税金を一覧で確認" },
          { href: "/cases/", title: "モデルケースを見る", description: "年代別のFIRE達成プランを参考に" },
        ]}
      />
    </div>
  );
}
