"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { brokers, type Broker } from "@/data/recommend";
import BrokerCard from "@/components/BrokerCard";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedContent from "@/components/RelatedContent";
import ShareButtons from "@/components/ShareButtons";
import { SITE_URL } from "@/config/site";
import {
  BASE_MONTHLY_COST,
  estimatePostFireMonthlyCost,
  grossToNet,
} from "@/config/assumptions";

/* ------------------------------------------------------------------ */
/*  定数 & 型                                                          */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 6;

/** Q1: 年齢選択肢 */
const AGE_OPTIONS = [
  { label: "20代", value: 25 },
  { label: "30代", value: 35 },
  { label: "40代", value: 45 },
  { label: "50代", value: 55 },
] as const;

/** Q2: 家族構成 */
const FAMILY_OPTIONS = [
  { label: "独身", value: "single" },
  { label: "夫婦（子なし）", value: "couple" },
  { label: "夫婦＋子あり", value: "couple-child" },
] as const;

/** Q3: 年収（万円） */
const INCOME_OPTIONS = [
  { label: "300万円以下", value: 250 },
  { label: "300〜500万円", value: 400 },
  { label: "500〜700万円", value: 600 },
  { label: "700〜1000万円", value: 850 },
  { label: "1000万円以上", value: 1200 },
] as const;

/** Q4: 毎月の貯蓄額（万円） */
const SAVINGS_OPTIONS = [
  { label: "3万円以下", value: 2 },
  { label: "3〜7万円", value: 5 },
  { label: "7〜15万円", value: 11 },
  { label: "15〜25万円", value: 20 },
  { label: "25万円以上", value: 30 },
] as const;

/** Q5: 現在の金融資産（万円） */
const ASSET_OPTIONS = [
  { label: "100万円以下", value: 50 },
  { label: "100〜500万円", value: 300 },
  { label: "500〜1000万円", value: 750 },
  { label: "1000〜3000万円", value: 2000 },
  { label: "3000万円以上", value: 5000 },
] as const;

/** Q6: 投資経験 */
const EXPERIENCE_OPTIONS = [
  { label: "まだ始めていない", value: "none" },
  { label: "NISA・投信で積立中", value: "beginner" },
  { label: "株式・ETFも運用中", value: "intermediate" },
] as const;

/** 家族係数（診断用簡易マッピング） */
const FAMILY_COEFF: Record<string, number> = {
  single: 1.0,
  couple: 1.3,
  "couple-child": 1.55,
};

/** assumptions.ts の familyType にマッピング（社会保険料計算用） */
const FAMILY_TO_ASSUMPTIONS: Record<string, string> = {
  single: "single",
  couple: "couple",
  "couple-child": "couple-1child",
};

const ANNUAL_RETURN = 0.04;
const SWR = 0.04;
const MAX_YEARS = 100;
const NATIONAL_AVERAGE_COEFF = 0.95;

const affiliateBrokers = brokers.filter((b) => b.isAffiliate);

type Grade = "A" | "B" | "C" | "D";
type FamilyType = "single" | "couple" | "couple-child";
type ExperienceType = "none" | "beginner" | "intermediate";

interface DiagnoseResult {
  achievementAge: number;
  yearsToFire: number;
  grade: Grade;
  impossible: boolean;
  deviation: number;
  fireTarget: number;
  monthlyExpense: number;
  savingsRate: number;
  investmentExperience: ExperienceType;
  familyType: FamilyType;
  annualIncome: number;
}

/* ------------------------------------------------------------------ */
/*  計算ロジック                                                        */
/* ------------------------------------------------------------------ */

function calculate(
  age: number,
  familyType: FamilyType,
  annualIncome: number,
  monthlySavings: number,
  currentAssets: number,
  experience: ExperienceType,
): DiagnoseResult {
  // パーソナライズされたFIRE目標額
  const coeff = FAMILY_COEFF[familyType];
  const assumptionsFamilyType = FAMILY_TO_ASSUMPTIONS[familyType];
  const postFireInsurance = estimatePostFireMonthlyCost(assumptionsFamilyType);
  const monthlyExpense =
    BASE_MONTHLY_COST * NATIONAL_AVERAGE_COEFF * coeff + postFireInsurance;
  const annualExpense = monthlyExpense * 12;
  const fireTarget = Math.round(annualExpense / SWR);

  // 貯蓄率
  const netIncome = grossToNet(annualIncome);
  const annualSavings = monthlySavings * 12;
  const savingsRate = Math.min(
    Math.round((annualSavings / netIncome) * 100),
    99,
  );

  // 達成シミュレーション
  const annualInvestment = monthlySavings * 12;
  let assets = currentAssets;
  let years = 0;

  while (assets < fireTarget && years < MAX_YEARS) {
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

  // FIRE偏差値
  let deviation: number;
  if (impossible) {
    deviation = 38;
  } else if (achievementAge >= 65) {
    deviation = 42;
  } else if (achievementAge >= 55) {
    deviation = 52 - Math.round(((achievementAge - 55) / 10) * 7);
  } else if (achievementAge >= 45) {
    deviation = 65 - Math.round(((achievementAge - 45) / 10) * 10);
  } else if (achievementAge >= 35) {
    deviation = 72 - Math.round(((achievementAge - 35) / 10) * 7);
  } else {
    deviation = 75;
  }

  return {
    achievementAge,
    yearsToFire: years,
    grade,
    impossible,
    deviation,
    fireTarget,
    monthlyExpense: Math.round(monthlyExpense * 10) / 10,
    savingsRate,
    investmentExperience: experience,
    familyType,
    annualIncome,
  };
}

/* ------------------------------------------------------------------ */
/*  What-If シナリオ計算                                                */
/* ------------------------------------------------------------------ */

function calcWhatIf(
  currentAssets: number,
  monthlySavings: number,
  fireTarget: number,
  returnRate: number,
): number {
  const annualInvestment = monthlySavings * 12;
  let assets = currentAssets;
  let years = 0;
  while (assets < fireTarget && years < MAX_YEARS) {
    assets = assets * (1 + returnRate) + annualInvestment;
    years++;
  }
  return years >= MAX_YEARS ? -1 : years;
}

/* ------------------------------------------------------------------ */
/*  ブローカーマッチング                                                 */
/* ------------------------------------------------------------------ */

interface MatchedBroker {
  broker: Broker;
  reason: string;
  isTop: boolean;
}

function matchBrokers(
  experience: ExperienceType,
  annualIncome: number,
  familyType: FamilyType,
): MatchedBroker[] {
  const candidates = affiliateBrokers.length > 0 ? affiliateBrokers : brokers.slice(0, 3);

  const scored = candidates.map((broker) => {
    let score = 0;
    let reason = "";

    if (experience === "none") {
      // 未経験者 → 始めやすさ重視
      if (broker.slug === "tossy") {
        score += 10;
        reason = "アプリで直感的に始められるため投資デビューに最適";
      } else if (broker.slug === "matsui") {
        score += 7;
        reason = "手厚いサポート体制で初めての投資も安心";
      } else if (broker.slug === "dmm") {
        score += 5;
        reason = "最短即日で口座開設、すぐに投資スタート可能";
      }
    } else if (experience === "beginner") {
      // NISA積立中 → 効率化重視
      if (broker.slug === "matsui") {
        score += 10;
        reason = "投信残高に応じたポイント還元でNISA運用を効率化";
      } else if (broker.slug === "tossy") {
        score += 7;
        reason = "株・FX・CFDまで1アプリで完結し投資の幅が広がる";
      } else if (broker.slug === "dmm") {
        score += 5;
        reason = "米国株手数料0円で海外分散投資に最適";
      }
    } else {
      // 中級者 → 米国株・iDeCo対応
      if (broker.slug === "dmm") {
        score += 10;
        reason = "米国株手数料0円でポートフォリオの海外比率を最適化";
      } else if (broker.slug === "matsui") {
        score += 7;
        reason = "iDeCo40本の品揃えで節税しながら資産形成を加速";
      } else if (broker.slug === "tossy") {
        score += 5;
        reason = "株・FX・CFDまでアプリ1つで幅広い資産運用が可能";
      }
    }

    // 高収入ボーナス: iDeCo対応を加点
    if (annualIncome >= 700 && broker.ideco) {
      score += 3;
      if (!reason) reason = "高年収者のiDeCo節税メリットが大きい証券口座";
    }

    // 家族ありボーナス: NISA対応を加点
    if (familyType !== "single" && broker.nisa) {
      score += 1;
    }

    if (!reason) {
      reason = broker.nisa ? "新NISA対応で非課税の資産形成をスタート" : "幅広い投資商品でFIRE達成を加速";
    }

    return { broker, score, reason };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.map((s, i) => ({
    broker: s.broker,
    reason: s.reason,
    isTop: i === 0,
  }));
}

/* ------------------------------------------------------------------ */
/*  アドバイス生成                                                      */
/* ------------------------------------------------------------------ */

function generateInsight(r: DiagnoseResult): string {
  const parts: string[] = [];

  // 貯蓄率に基づくアドバイス
  if (r.savingsRate >= 50) {
    parts.push(
      `貯蓄率${r.savingsRate}%は非常に優秀です。この高い貯蓄率を維持できれば、FIRE達成は十分に現実的です。`,
    );
  } else if (r.savingsRate >= 30) {
    parts.push(
      `貯蓄率${r.savingsRate}%は平均を大きく上回る水準です。固定費の見直しでさらに加速できる可能性があります。`,
    );
  } else if (r.savingsRate >= 15) {
    parts.push(
      `貯蓄率${r.savingsRate}%は平均的な水準です。まずは家賃・通信費・保険の固定費3大項目を見直して、貯蓄率30%を目指しましょう。`,
    );
  } else {
    parts.push(
      `貯蓄率${r.savingsRate}%には改善の余地があります。まずは毎月の支出を把握し、固定費の削減から始めましょう。格安SIM・保険の見直しだけでも月1〜2万円の節約が期待できます。`,
    );
  }

  // 投資経験に基づくアドバイス
  if (r.investmentExperience === "none") {
    parts.push(
      "投資はまだ始めていないとのこと。まずは新NISAのつみたて投資枠で、全世界株式インデックスファンドの積立から始めるのがおすすめです。月1万円からでもスタートできます。",
    );
  } else if (r.investmentExperience === "beginner") {
    parts.push(
      "NISA・投信での積立を実践中なのは素晴らしいです。次のステップとして、つみたて投資枠の年間上限（120万円）を目指しつつ、成長投資枠の活用も検討してみましょう。",
    );
  } else {
    parts.push(
      "株式・ETFの運用経験があるのは大きな強みです。NISA枠（年間360万円）のフル活用と、iDeCoによる節税効果の最大化で、FIRE達成をさらに加速できます。",
    );
  }

  return parts.join("\n\n");
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
    message:
      "素晴らしい！あなたは早期FIREが見えています。この調子で資産形成を続けましょう。",
    emoji: "S",
  },
  B: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-300",
    ring: "ring-blue-200",
    title: "FIRE有望株",
    message:
      "いい線いっています！貯蓄率をもう少し上げれば、さらに早くFIREに到達できます。",
    emoji: "A",
  },
  C: {
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    ring: "ring-yellow-200",
    title: "FIRE挑戦者",
    message:
      "まだまだこれから！支出の見直しと投資戦略の最適化でFIREを加速できます。",
    emoji: "B",
  },
  D: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-300",
    ring: "ring-red-200",
    title: "FIRE準備中",
    message:
      "まずは貯蓄習慣と資産運用の第一歩から。正しい戦略を立てれば道は開けます。",
    emoji: "C",
  },
};

/** 貯蓄率ラベル */
function savingsRateLabel(rate: number): { label: string; color: string } {
  if (rate >= 50) return { label: "加速モード", color: "text-green-700" };
  if (rate >= 30) return { label: "優秀", color: "text-blue-700" };
  if (rate >= 15) return { label: "平均的", color: "text-yellow-700" };
  return { label: "改善余地あり", color: "text-red-700" };
}

/* ------------------------------------------------------------------ */
/*  UIコンポーネント                                                     */
/* ------------------------------------------------------------------ */

/** 選択肢ボタン */
const OptionButton = memo(function OptionButton({
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
});

/** プログレスバー */
const ProgressBar = memo(function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div className="mx-auto mb-8 w-full max-w-md">
      <div className="mb-2 flex justify-between text-xs font-medium text-gray-500">
        <span>
          質問 {step} / {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="診断の進捗"
      >
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
});

/** 戻るボタン */
const BackButton = memo(function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex min-h-[44px] items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
        前の質問に戻る
      </button>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  メインページ                                                        */
/* ------------------------------------------------------------------ */

export default function DiagnosePage() {
  // 0=intro, 1-6=questions, 7=result
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number | null>(null);
  const [familyType, setFamilyType] = useState<FamilyType | null>(null);
  const [income, setIncome] = useState<number | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  const [assets, setAssets] = useState<number | null>(null);
  const [experience, setExperience] = useState<ExperienceType | null>(null);
  const [result, setResult] = useState<DiagnoseResult | null>(null);

  const handleAge = useCallback((v: number) => {
    setAge(v);
    setTimeout(() => setStep(2), 300);
  }, []);

  const handleFamily = useCallback((v: FamilyType) => {
    setFamilyType(v);
    setTimeout(() => setStep(3), 300);
  }, []);

  const handleIncome = useCallback((v: number) => {
    setIncome(v);
    setTimeout(() => setStep(4), 300);
  }, []);

  const handleSavings = useCallback((v: number) => {
    setSavings(v);
    setTimeout(() => setStep(5), 300);
  }, []);

  const handleAssets = useCallback((v: number) => {
    setAssets(v);
    setTimeout(() => setStep(6), 300);
  }, []);

  const handleExperience = useCallback(
    (v: ExperienceType) => {
      setExperience(v);
      if (
        age !== null &&
        familyType !== null &&
        income !== null &&
        savings !== null &&
        assets !== null
      ) {
        const r = calculate(age, familyType, income, savings, assets, v);
        setResult(r);
      }
      setTimeout(() => setStep(7), 400);
    },
    [age, familyType, income, savings, assets],
  );

  const handleRetry = useCallback(() => {
    setStep(0);
    setAge(null);
    setFamilyType(null);
    setIncome(null);
    setSavings(null);
    setAssets(null);
    setExperience(null);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumb
        items={[{ label: "ホーム", href: "/" }, { label: "FIRE診断" }]}
      />

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
              aria-hidden="true"
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
            <span className="font-bold text-primary-600">6つの質問</span>
            であなた専用のFIRE達成度を診断します。
          </p>
          <p className="mt-1 text-sm text-gray-500">所要時間：約1分</p>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn-primary mt-8 text-lg"
          >
            診断スタート
          </button>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-primary-600">6問</p>
              <p className="mt-1 text-xs text-gray-600">カンタン質問</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-primary-600">1分</p>
              <p className="mt-1 text-xs text-gray-600">サクッと診断</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-primary-600">4段階</p>
              <p className="mt-1 text-xs text-gray-600">ランク判定</p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  STEP 1 : 年齢                                                   */}
      {/* ================================================================ */}
      {step === 1 && (
        <section className="animate-fadeIn" aria-label="質問1: 年齢">
          <ProgressBar step={1} total={TOTAL_STEPS} />
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
        </section>
      )}

      {/* ================================================================ */}
      {/*  STEP 2 : 家族構成                                               */}
      {/* ================================================================ */}
      {step === 2 && (
        <section className="animate-fadeIn" aria-label="質問2: 家族構成">
          <ProgressBar step={2} total={TOTAL_STEPS} />
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Q2. 家族構成は？
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            現在の家族構成を選んでください
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3">
            {FAMILY_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={familyType === opt.value}
                onClick={() => handleFamily(opt.value as FamilyType)}
              />
            ))}
          </div>
          <BackButton onClick={() => setStep(1)} />
        </section>
      )}

      {/* ================================================================ */}
      {/*  STEP 3 : 年収                                                   */}
      {/* ================================================================ */}
      {step === 3 && (
        <section className="animate-fadeIn" aria-label="質問3: 年収">
          <ProgressBar step={3} total={TOTAL_STEPS} />
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Q3. 年収（額面）は？
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            税込みのおおよその年収を選んでください
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {INCOME_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={income === opt.value}
                onClick={() => handleIncome(opt.value)}
              />
            ))}
          </div>
          <BackButton onClick={() => setStep(2)} />
        </section>
      )}

      {/* ================================================================ */}
      {/*  STEP 4 : 毎月の貯蓄額                                           */}
      {/* ================================================================ */}
      {step === 4 && (
        <section className="animate-fadeIn" aria-label="質問4: 毎月の貯蓄額">
          <ProgressBar step={4} total={TOTAL_STEPS} />
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Q4. 毎月の貯蓄額は？
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            投資・貯金に回せる月額を選んでください
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SAVINGS_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={savings === opt.value}
                onClick={() => handleSavings(opt.value)}
              />
            ))}
          </div>
          <BackButton onClick={() => setStep(3)} />
        </section>
      )}

      {/* ================================================================ */}
      {/*  STEP 5 : 金融資産                                               */}
      {/* ================================================================ */}
      {step === 5 && (
        <section className="animate-fadeIn" aria-label="質問5: 現在の金融資産">
          <ProgressBar step={5} total={TOTAL_STEPS} />
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Q5. 現在の金融資産は？
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
          <BackButton onClick={() => setStep(4)} />
        </section>
      )}

      {/* ================================================================ */}
      {/*  STEP 6 : 投資経験                                               */}
      {/* ================================================================ */}
      {step === 6 && (
        <section className="animate-fadeIn" aria-label="質問6: 投資経験">
          <ProgressBar step={6} total={TOTAL_STEPS} />
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Q6. 投資経験は？
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            現在の投資状況に近いものを選んでください
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={experience === opt.value}
                onClick={() => handleExperience(opt.value as ExperienceType)}
              />
            ))}
          </div>
          <BackButton onClick={() => setStep(5)} />
        </section>
      )}

      {/* ================================================================ */}
      {/*  RESULT                                                          */}
      {/* ================================================================ */}
      {step === 7 && result && (
        <section
          className="animate-fadeIn"
          aria-label="診断結果"
          aria-live="polite"
        >
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900 sm:text-2xl">
            診断結果
          </h2>

          {/* ---- 1. グレードカード ---- */}
          {(() => {
            const cfg = GRADE_CONFIG[result.grade];
            return (
              <div
                className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-6 text-center shadow-lg ring-4 ${cfg.ring} sm:p-8`}
              >
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
                        あと約{result.yearsToFire}年で目標資産
                        {result.fireTarget.toLocaleString()}万円に到達
                      </p>
                    </>
                  )}
                </div>

                {/* パーソナライズFIRE目標 */}
                <div className="mt-3 rounded-lg bg-white/60 px-4 py-3">
                  <p className="text-xs text-gray-500">
                    あなたのFIRE目標額（推定月{result.monthlyExpense}万円
                    &times; 25年分）
                  </p>
                  <p className="mt-1 text-2xl font-black text-gray-900">
                    {result.fireTarget.toLocaleString()}
                    <span className="text-base font-bold text-gray-500">
                      万円
                    </span>
                  </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {cfg.message}
                </p>
              </div>
            );
          })()}

          {/* ---- 2. 3指標ダッシュボード ---- */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500">達成予測年齢</p>
              <p className="mt-1 text-2xl font-black text-gray-900">
                {result.impossible ? "—" : `${result.achievementAge}歳`}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500">貯蓄率</p>
              <p className="mt-1 text-2xl font-black text-gray-900">
                {result.savingsRate}%
              </p>
              <p
                className={`mt-0.5 text-[10px] font-bold ${savingsRateLabel(result.savingsRate).color}`}
              >
                {savingsRateLabel(result.savingsRate).label}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500">残り</p>
              <p className="mt-1 text-2xl font-black text-gray-900">
                {result.impossible ? "—" : `${result.yearsToFire}年`}
              </p>
            </div>
          </div>

          {/* ---- 3. パーソナライズドアドバイス ---- */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-gray-800">
              あなたへのアドバイス
            </h3>
            {generateInsight(result)
              .split("\n\n")
              .map((p, i) => (
                <p
                  key={i}
                  className="mt-2 text-sm leading-relaxed text-gray-600 first:mt-0"
                >
                  {p}
                </p>
              ))}
          </div>

          {/* ---- 4. What-If ミニテーブル ---- */}
          {savings !== null && assets !== null && !result.impossible && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-bold text-gray-800">
                もし条件が変わったら？
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500">
                      <th className="px-3 py-2 text-left font-medium">
                        シナリオ
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        達成年数
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        短縮
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* 積立額+3万 */}
                    {(() => {
                      const newYears = calcWhatIf(
                        assets,
                        savings + 3,
                        result.fireTarget,
                        ANNUAL_RETURN,
                      );
                      const diff =
                        newYears >= 0 ? result.yearsToFire - newYears : null;
                      return (
                        <tr>
                          <td className="px-3 py-2 text-gray-700">
                            積立額を+3万円
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-gray-900">
                            {newYears >= 0 ? `${newYears}年` : "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-green-600">
                            {diff !== null && diff > 0
                              ? `${diff}年短縮`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })()}
                    {/* 利回り5% */}
                    {(() => {
                      const newYears = calcWhatIf(
                        assets,
                        savings,
                        result.fireTarget,
                        0.05,
                      );
                      const diff =
                        newYears >= 0 ? result.yearsToFire - newYears : null;
                      return (
                        <tr>
                          <td className="px-3 py-2 text-gray-700">
                            利回り5%で運用
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-gray-900">
                            {newYears >= 0 ? `${newYears}年` : "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-green-600">
                            {diff !== null && diff > 0
                              ? `${diff}年短縮`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---- 5. 詳細シミュレーターCTA ---- */}
          <div className="mt-6 rounded-xl border-2 border-primary-200 bg-primary-50 p-6 text-center">
            <p className="text-lg font-bold text-primary-800">
              もっと正確な数字を知りたい？
            </p>
            <p className="mt-1 text-sm text-primary-700">
              地域・年収・家族構成をもとに、詳細なFIREシミュレーションができます
            </p>
            <Link
              href={`/simulate/?age=${age ?? 35}&income=${income ?? 500}&assets=${assets ?? 300}&invest=${savings ?? 10}&family=${familyType === "couple-child" ? "couple-1child" : (familyType ?? "single")}`}
              className="btn-primary mt-4 inline-block"
            >
              詳細シミュレーションで正確な数字を確認
            </Link>
          </div>

          {/* ---- 6. 証券口座レコメンド ---- */}
          {affiliateBrokers.length > 0 && (
            <div className="mt-6 rounded-xl border-2 border-accent-200 bg-accent-50 p-6">
              <h3 className="mb-1 text-center text-lg font-bold text-accent-800">
                {result.investmentExperience === "none"
                  ? "あなたに合った証券口座を開設しよう"
                  : result.investmentExperience === "beginner"
                    ? "NISA運用をさらに効率化しませんか？"
                    : "ポートフォリオを最適化する証券口座"}
              </h3>
              <p className="mb-4 text-center text-xs text-gray-600">
                {result.investmentExperience === "none"
                  ? "FIREへの第一歩は証券口座の開設。新NISAで非課税の積立投資を始めましょう"
                  : result.investmentExperience === "beginner"
                    ? "新NISAを活用した非課税投資で、FIRE達成をさらに数年短縮できます"
                    : "手数料の最適化と投資先の分散で、FIRE達成を加速しましょう"}
              </p>
              <div className="space-y-3">
                {matchBrokers(
                  result.investmentExperience,
                  result.annualIncome,
                  result.familyType,
                ).map(({ broker, reason, isTop }) => (
                  <div key={broker.slug}>
                    {isTop && (
                      <div className="mb-1 flex items-center justify-center">
                        <span className="rounded-full bg-accent-600 px-3 py-0.5 text-xs font-bold text-white">
                          あなたにおすすめ
                        </span>
                      </div>
                    )}
                    <BrokerCard broker={broker} />
                    <p className="mt-1 px-2 text-xs text-gray-500">{reason}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
                <Link
                  href="/recommend/"
                  className="text-accent-700 underline hover:text-accent-600"
                >
                  おすすめ証券口座をもっと見る
                </Link>
                <Link
                  href="/guide/fire-first-steps/"
                  className="text-accent-700 underline hover:text-accent-600"
                >
                  FIRE初心者ガイドを読む
                </Link>
              </div>
            </div>
          )}

          {/* 前提条件 */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-xs text-gray-600">
            <p className="font-medium text-gray-600">診断の前提条件</p>
            <ul className="mt-2 space-y-1">
              <li>
                - FIRE目標: 推定月間生活費 &times; 12ヶ月 &divide;{" "}
                {(SWR * 100).toFixed(0)}%（安全引出率）
              </li>
              <li>
                - 想定年利回り: {(ANNUAL_RETURN * 100).toFixed(0)}%
                （インフレ調整後）
              </li>
              <li>- 生活費は全国平均 &times; 家族係数で概算</li>
              <li>- 毎月一定額を積立投資した場合の概算値</li>
            </ul>
          </div>

          {/* シェアボタン */}
          <div className="mt-8">
            <p className="mb-3 text-center text-sm font-medium text-gray-600">
              結果をシェアする
            </p>
            {(() => {
              const cfg = GRADE_CONFIG[result.grade];
              const shareText = result.impossible
                ? `FIRE偏差値${result.deviation}（${cfg.title}）でした！目標額${result.fireTarget.toLocaleString()}万円に向けて戦略を立てます。あなたも診断してみよう！`
                : `FIRE偏差値${result.deviation}（${cfg.title}／${result.achievementAge}歳でFIRE達成予測）でした！目標額${result.fireTarget.toLocaleString()}万円。あなたも診断してみよう！`;
              const shareUrl =
                typeof window !== "undefined"
                  ? window.location.origin + "/diagnose/"
                  : `${SITE_URL}/diagnose/`;
              return (
                <ShareButtons
                  text={shareText}
                  url={shareUrl}
                  copyContent={`${shareText}\n${shareUrl}`}
                  showFacebook={false}
                  showLine={false}
                />
              );
            })()}
          </div>

          <RelatedContent
            heading="次のステップ"
            items={[
              {
                href: "/tracker/",
                title: "FIRE進捗トラッカー",
                description: "毎月の資産を記録してFIRE達成度を可視化",
              },
              {
                href: "/withdraw/",
                title: "取り崩しシミュレーション",
                description: "FIRE後に資産が何歳まで持つか計算",
              },
              {
                href: "/income/",
                title: "手取り早見表",
                description: "年収別の手取り額・税金を一覧で確認",
              },
              {
                href: "/cases/",
                title: "モデルケースを見る",
                description: "年代別のFIRE達成プランを参考に",
              },
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
        </section>
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
