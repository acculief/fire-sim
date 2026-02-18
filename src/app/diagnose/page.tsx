"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { brokers } from "@/data/recommend";
import BrokerCard from "@/components/BrokerCard";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedContent from "@/components/RelatedContent";
import { SITE_URL } from "@/config/site";

/* ------------------------------------------------------------------ */
/*  定数 & 型                                                          */
/* ------------------------------------------------------------------ */

/** 年齢選択肢 */
const AGE_OPTIONS = [
  { label: "20代", value: 25 },
  { label: "30代", value: 35 },
  { label: "40代", value: 45 },
  { label: "50代", value: 55 },
] as const;

/** 毎月の貯蓄額（万円） */
const SAVINGS_OPTIONS = [
  { label: "5万円以下", value: 3 },
  { label: "5〜10万円", value: 7.5 },
  { label: "10〜20万円", value: 15 },
  { label: "20万円以上", value: 25 },
] as const;

/** 現在の金融資産（万円） */
const ASSET_OPTIONS = [
  { label: "100万円以下", value: 50 },
  { label: "100〜500万円", value: 300 },
  { label: "500〜1000万円", value: 750 },
  { label: "1000〜3000万円", value: 2000 },
  { label: "3000万円以上", value: 5000 },
] as const;

const FIRE_TARGET = 7500; // 万円
const ANNUAL_RETURN = 0.04;
const MAX_YEARS = 100; // 収束しない場合の上限

const affiliateBrokers = brokers.filter((b) => b.isAffiliate);

type Grade = "A" | "B" | "C" | "D";

interface DiagnoseResult {
  achievementAge: number;
  yearsToFire: number;
  grade: Grade;
  impossible: boolean;
  deviation: number; // FIRE偏差値 (40-75)
}

/* ------------------------------------------------------------------ */
/*  計算ロジック                                                        */
/* ------------------------------------------------------------------ */

function calculate(
  age: number,
  monthlySavings: number,
  currentAssets: number,
): DiagnoseResult {
  const annualInvestment = monthlySavings * 12;
  let assets = currentAssets;
  let years = 0;

  while (assets < FIRE_TARGET && years < MAX_YEARS) {
    assets = assets * (1 + ANNUAL_RETURN) + annualInvestment;
    years++;
  }

  const impossible = years >= MAX_YEARS;
  const achievementAge = impossible ? 999 : age + years;

  let grade: Grade;
  if (impossible || achievementAge > 65) {
    grade = "D";
  } else if (achievementAge > 55) {
    grade = "C";
  } else if (achievementAge > 45) {
    grade = "B";
  } else {
    grade = "A";
  }

  // FIRE偏差値: 達成年齢が若いほど高い (40-75スケール)
  // 65歳以上 or impossible → 40, 45歳以下 → 70-75
  let deviation: number;
  if (impossible) {
    deviation = 38;
  } else if (achievementAge >= 65) {
    deviation = 42;
  } else if (achievementAge >= 55) {
    // 55-65 → 45-52
    deviation = 52 - Math.round(((achievementAge - 55) / 10) * 7);
  } else if (achievementAge >= 45) {
    // 45-55 → 55-65
    deviation = 65 - Math.round(((achievementAge - 45) / 10) * 10);
  } else if (achievementAge >= 35) {
    // 35-45 → 65-72
    deviation = 72 - Math.round(((achievementAge - 35) / 10) * 7);
  } else {
    deviation = 75;
  }

  return { achievementAge, yearsToFire: years, grade, impossible, deviation };
}

/* ------------------------------------------------------------------ */
/*  グレード設定                                                        */
/* ------------------------------------------------------------------ */

const GRADE_CONFIG: Record<
  Grade,
  {
    color: string;
    bg: string;
    border: string;
    ring: string;
    title: string;
    message: string;
    emoji: string;
  }
> = {
  A: {
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-300",
    ring: "ring-green-200",
    title: "FIRE達人",
    message: "素晴らしい！あなたは早期FIREが見えています。この調子で資産形成を続けましょう。",
    emoji: "S",
  },
  B: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-300",
    ring: "ring-blue-200",
    title: "FIRE有望株",
    message: "いい線いっています！貯蓄率をもう少し上げれば、さらに早くFIREに到達できます。",
    emoji: "A",
  },
  C: {
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    ring: "ring-yellow-200",
    title: "FIRE挑戦者",
    message: "まだまだこれから！支出の見直しと投資戦略の最適化でFIREを加速できます。",
    emoji: "B",
  },
  D: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-300",
    ring: "ring-red-200",
    title: "FIRE準備中",
    message: "まずは貯蓄習慣と資産運用の第一歩から。正しい戦略を立てれば道は開けます。",
    emoji: "C",
  },
};

/* ------------------------------------------------------------------ */
/*  コンポーネント                                                      */
/* ------------------------------------------------------------------ */

/** 選択肢ボタン */
function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-xl border-2 px-4 py-4 text-center text-base font-semibold transition-all duration-200 sm:text-lg ${
        selected
          ? "border-primary-500 bg-primary-50 text-primary-700 shadow-md ring-2 ring-primary-200"
          : "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-sm"
      }`}
    >
      {label}
    </button>
  );
}

/** プログレスバー */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div className="mx-auto mb-8 w-full max-w-md">
      <div className="mb-2 flex justify-between text-xs font-medium text-gray-500">
        <span>
          質問 {step} / {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="診断の進捗">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** シェアボタン群 */
function ShareButtons({ result }: { result: DiagnoseResult }) {
  const [copied, setCopied] = useState(false);
  const cfg = GRADE_CONFIG[result.grade];

  const shareText = result.impossible
    ? `FIRE偏差値${result.deviation}（${cfg.title}）でした！まずは戦略を立てるところから。あなたも診断してみよう！`
    : `FIRE偏差値${result.deviation}（${cfg.title}／${result.achievementAge}歳でFIRE達成予測）でした！あなたも診断してみよう！`;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.origin + "/diagnose/"
      : `${SITE_URL}/diagnose/`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [shareText, shareUrl]);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 sm:w-auto"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Xで共有
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3a2.25 2.25 0 0 0-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
          />
        </svg>
        {copied ? "コピーしました！" : "URLをコピー"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  メインページ                                                        */
/* ------------------------------------------------------------------ */

export default function DiagnosePage() {
  const [step, setStep] = useState(0); // 0 = intro, 1-3 = questions, 4 = result
  const [age, setAge] = useState<number | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  const [assets, setAssets] = useState<number | null>(null);
  const [result, setResult] = useState<DiagnoseResult | null>(null);

  const handleAge = useCallback((v: number) => {
    setAge(v);
    setTimeout(() => setStep(2), 300);
  }, []);

  const handleSavings = useCallback((v: number) => {
    setSavings(v);
    setTimeout(() => setStep(3), 300);
  }, []);

  const handleAssets = useCallback(
    (v: number) => {
      setAssets(v);
      if (age !== null && savings !== null) {
        const r = calculate(age, savings, v);
        setResult(r);
      }
      setTimeout(() => setStep(4), 400);
    },
    [age, savings],
  );

  const handleRetry = useCallback(() => {
    setStep(0);
    setAge(null);
    setSavings(null);
    setAssets(null);
    setResult(null);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "FIRE診断" }]} />

      {/* ================================================================ */}
      {/*  INTRO                                                           */}
      {/* ================================================================ */}
      {step === 0 && (
        <div className="animate-fadeIn text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <svg
              className="h-10 w-10 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            FIRE達成度診断
          </h1>
          <p className="mt-3 text-gray-600">
            たった<span className="font-bold text-primary-600">3つの質問</span>
            であなたのFIRE達成度を診断します。
          </p>
          <p className="mt-1 text-sm text-gray-500">所要時間：約30秒</p>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn-primary mt-8 text-lg"
          >
            診断スタート
          </button>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-primary-600">3問</p>
              <p className="mt-1 text-xs text-gray-500">カンタン質問</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-primary-600">30秒</p>
              <p className="mt-1 text-xs text-gray-500">サクッと診断</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-primary-600">4段階</p>
              <p className="mt-1 text-xs text-gray-500">ランク判定</p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  STEP 1 : 年齢                                                   */}
      {/* ================================================================ */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <ProgressBar step={1} total={3} />
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Q1. あなたの年齢は？
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            現在の年代を選んでください
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {AGE_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={age === opt.value}
                onClick={() => handleAge(opt.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  STEP 2 : 毎月の貯蓄額                                           */}
      {/* ================================================================ */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <ProgressBar step={2} total={3} />
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Q2. 毎月の貯蓄額は？
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            投資・貯金に回せる月額を選んでください
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {SAVINGS_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={savings === opt.value}
                onClick={() => handleSavings(opt.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  STEP 3 : 金融資産                                               */}
      {/* ================================================================ */}
      {step === 3 && (
        <div className="animate-fadeIn">
          <ProgressBar step={3} total={3} />
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Q3. 現在の金融資産は？
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            預貯金・株式・投資信託などの合計額を選んでください
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ASSET_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={assets === opt.value}
                onClick={() => handleAssets(opt.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  RESULT                                                          */}
      {/* ================================================================ */}
      {step === 4 && result && (
        <div className="animate-fadeIn">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900 sm:text-2xl">
            診断結果
          </h2>

          {/* 結果カード */}
          {(() => {
            const cfg = GRADE_CONFIG[result.grade];
            return (
              <div
                className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-6 text-center shadow-lg ring-4 ${cfg.ring} sm:p-8`}
              >
                {/* グレードバッジ */}
                <div className="mb-4 inline-flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-500">
                    FIRE達成度
                  </span>
                  <span
                    className={`mt-1 text-6xl font-black ${cfg.color} sm:text-7xl`}
                  >
                    {result.grade}
                  </span>
                </div>

                {/* タイトル */}
                <p className={`text-xl font-bold ${cfg.color} sm:text-2xl`}>
                  {cfg.title}
                </p>

                {/* FIRE偏差値 */}
                <div className="mt-3 inline-flex items-baseline gap-1 rounded-full bg-white/60 px-4 py-2">
                  <span className="text-sm text-gray-500">FIRE偏差値</span>
                  <span className={`text-3xl font-black ${cfg.color}`}>
                    {result.deviation}
                  </span>
                </div>

                {/* 達成予測年齢 */}
                <div className="mt-4 rounded-xl bg-white/70 px-4 py-4">
                  {result.impossible ? (
                    <p className="text-lg font-bold text-gray-700">
                      現在のペースだとFIRE達成は難しい状況です
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">
                        FIRE達成予測年齢
                      </p>
                      <p className="mt-1 text-4xl font-black text-gray-900 sm:text-5xl">
                        {result.achievementAge}
                        <span className="text-xl font-bold text-gray-500">
                          歳
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        あと約{result.yearsToFire}年で目標資産{FIRE_TARGET.toLocaleString()}万円に到達
                      </p>
                    </>
                  )}
                </div>

                {/* メッセージ */}
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {cfg.message}
                </p>
              </div>
            );
          })()}

          {/* 前提条件 */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-xs text-gray-500">
            <p className="font-medium text-gray-600">診断の前提条件</p>
            <ul className="mt-2 space-y-1">
              <li>- 目標FIRE資産: {FIRE_TARGET.toLocaleString()}万円（年間生活費300万円 x 25年分）</li>
              <li>- 想定年利回り: {(ANNUAL_RETURN * 100).toFixed(0)}%（インフレ調整後）</li>
              <li>- 毎月一定額を積立投資した場合の概算値</li>
            </ul>
          </div>

          {/* シェアボタン */}
          <div className="mt-8">
            <p className="mb-3 text-center text-sm font-medium text-gray-600">
              結果をシェアする
            </p>
            <ShareButtons result={result} />
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-xl border-2 border-primary-200 bg-primary-50 p-6 text-center">
            <p className="text-lg font-bold text-primary-800">
              もっと正確な数字を知りたい？
            </p>
            <p className="mt-1 text-sm text-primary-700">
              地域・年収・家族構成をもとに、詳細なFIREシミュレーションができます
            </p>
            <Link href="/simulate/" className="btn-primary mt-4 inline-block">
              詳細シミュレーションで正確な数字を確認
            </Link>
          </div>

          {/* 証券口座CTA */}
          {affiliateBrokers.length > 0 && (
            <div className="mt-6 rounded-xl border-2 border-accent-200 bg-accent-50 p-6">
              <h3 className="mb-1 text-center text-lg font-bold text-accent-800">
                {result.grade === "A" || result.grade === "B"
                  ? "FIRE達成をさらに加速しましょう"
                  : "まずは証券口座を開設して第一歩を踏み出そう"}
              </h3>
              <p className="mb-4 text-center text-xs text-gray-600">
                {result.grade === "A" || result.grade === "B"
                  ? "新NISAを活用した非課税投資で、FIRE達成をさらに数年短縮できます"
                  : "FIREへの第一歩は証券口座の開設。新NISAで非課税の積立投資を始めましょう"}
              </p>
              <div className="space-y-3">
                {affiliateBrokers.map((b) => (
                  <BrokerCard key={b.slug} broker={b} />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
                <Link href="/recommend/" className="text-accent-700 underline hover:text-accent-600">
                  おすすめ証券口座をもっと見る
                </Link>
                <Link href="/guide/fire-first-steps/" className="text-accent-700 underline hover:text-accent-600">
                  FIRE初心者ガイドを読む
                </Link>
              </div>
            </div>
          )}

          <RelatedContent
            heading="次のステップ"
            items={[
              { href: "/tracker/", title: "FIRE進捗トラッカー", description: "毎月の資産を記録してFIRE達成度を可視化" },
              { href: "/withdraw/", title: "取り崩しシミュレーション", description: "FIRE後に資産が何歳まで持つか計算" },
              { href: "/income/", title: "手取り早見表", description: "年収別の手取り額・税金を一覧で確認" },
              { href: "/cases/", title: "モデルケースを見る", description: "年代別のFIRE達成プランを参考に" },
            ]}
          />

          {/* もう一度 */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleRetry}
              className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-500 hover:underline"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  アニメーション用スタイル                                           */}
      {/* ================================================================ */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
