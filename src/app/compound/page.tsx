"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedContent from "@/components/RelatedContent";
import NumberInput from "@/components/NumberInput";
import { formatMoney } from "@/lib/format";
import BrokerCtaSection from "@/components/BrokerCtaSection";

/* ------------------------------------------------------------------ */
/*  型定義                                                              */
/* ------------------------------------------------------------------ */

interface YearlyRecord {
  year: number;
  principal: number;
  totalAssets: number;
  investmentReturn: number;
}

interface CompoundResult {
  records: YearlyRecord[];
  totalPrincipal: number;
  totalAssets: number;
  totalReturn: number;
  returnRate: number;
}

/* ------------------------------------------------------------------ */
/*  計算ロジック（複利積立）                                               */
/* ------------------------------------------------------------------ */

function calcCompound(
  initialAmount: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
): CompoundResult {
  const records: YearlyRecord[] = [];
  let assets = initialAmount;
  const annualContribution = monthlyContribution * 12;

  // 0年目
  records.push({
    year: 0,
    principal: initialAmount,
    totalAssets: Math.round(initialAmount),
    investmentReturn: 0,
  });

  for (let y = 1; y <= years; y++) {
    const returnAmount = assets * annualReturn;
    assets = assets + returnAmount + annualContribution;
    const principal = initialAmount + annualContribution * y;

    records.push({
      year: y,
      principal: Math.round(principal),
      totalAssets: Math.round(assets),
      investmentReturn: Math.round(assets - principal),
    });
  }

  const totalPrincipal = initialAmount + annualContribution * years;
  const totalReturn = assets - totalPrincipal;

  return {
    records,
    totalPrincipal: Math.round(totalPrincipal),
    totalAssets: Math.round(assets),
    totalReturn: Math.round(totalReturn),
    returnRate: totalPrincipal > 0 ? (totalReturn / totalPrincipal) * 100 : 0,
  };
}

/* ------------------------------------------------------------------ */
/*  コンポーネント                                                      */
/* ------------------------------------------------------------------ */

export default function CompoundPage() {
  const [initialAmount, setInitialAmount] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(5);
  const [annualReturn, setAnnualReturn] = useState(5);
  const [years, setYears] = useState(20);
  const [result, setResult] = useState<CompoundResult | null>(null);

  const handleSimulate = useCallback(() => {
    const res = calcCompound(
      initialAmount,
      monthlyContribution,
      annualReturn / 100,
      years,
    );
    setResult(res);

    setTimeout(() => {
      document
        .getElementById("compound-result")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [initialAmount, monthlyContribution, annualReturn, years]);

  // バーチャート用データ（5年ごと + 最終年）
  const chartData = useMemo(
    () =>
      result
        ? result.records.filter(
            (r) => r.year === 0 || r.year % 5 === 0 || r.year === years,
          )
        : [],
    [result, years],
  );
  const maxChartAssets = useMemo(
    () =>
      result ? Math.max(...result.records.map((r) => r.totalAssets), 1) : 1,
    [result],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "複利計算シミュレーション" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        複利計算シミュレーション
      </h1>
      <p className="mt-2 text-gray-600">
        毎月の積立額と想定利回りから、将来の資産額を複利で計算します。元本と運用益の内訳も一目で分かります。
      </p>

      {/* 入力フォーム */}
      <div className="card mt-6">
        <h2 className="text-lg font-bold text-gray-800">条件を入力</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="initialAmount"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              初期投資額（万円）
            </label>
            <NumberInput
              id="initialAmount"
              className="input-field"
              value={initialAmount}
              onValueChange={setInitialAmount}
              min={0}
              step={10}
            />
          </div>
          <div>
            <label
              htmlFor="monthlyContribution"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              毎月の積立額（万円）
            </label>
            <NumberInput
              id="monthlyContribution"
              className="input-field"
              value={monthlyContribution}
              onValueChange={setMonthlyContribution}
              min={0}
              step={1}
            />
          </div>
          <div>
            <label
              htmlFor="annualReturn"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              想定利回り（年率%）
            </label>
            <NumberInput
              id="annualReturn"
              className="input-field"
              value={annualReturn}
              onValueChange={setAnnualReturn}
              min={0}
              max={20}
              step={0.5}
            />
          </div>
          <div>
            <label
              htmlFor="years"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              運用期間（年）
            </label>
            <NumberInput
              id="years"
              className="input-field"
              value={years}
              onValueChange={setYears}
              min={1}
              max={50}
            />
          </div>
        </div>
        <button
          type="button"
          className="btn-primary mt-6 w-full"
          onClick={handleSimulate}
        >
          シミュレーション開始
        </button>
      </div>

      {/* 結果表示 */}
      {result && (
        <div id="compound-result" className="mt-8 space-y-6">
          {/* ヘッドラインカード */}
          <div className="card">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">最終資産額</p>
                <p className="mt-1 text-3xl font-bold text-primary-700">
                  {formatMoney(result.totalAssets)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">投資元本</p>
                <p className="mt-1 text-3xl font-bold text-gray-800">
                  {formatMoney(result.totalPrincipal)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">運用益</p>
                <p className="mt-1 text-3xl font-bold text-accent-700">
                  +{formatMoney(result.totalReturn)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">運用益率</p>
                <p className="mt-1 text-3xl font-bold text-gray-800">
                  +{result.returnRate.toFixed(1)}
                  <span className="text-lg">%</span>
                </p>
              </div>
            </div>
          </div>

          {/* 積み上げバーチャート */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800">資産推移</h2>
            <div className="mt-1 flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-primary-400" />
                元本
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-accent-400" />
                運用益
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {chartData.map((record) => {
                const principalPct =
                  maxChartAssets > 0
                    ? Math.round((record.principal / maxChartAssets) * 100)
                    : 0;
                const returnPct =
                  maxChartAssets > 0
                    ? Math.round(
                        (record.investmentReturn / maxChartAssets) * 100,
                      )
                    : 0;

                return (
                  <div key={record.year} className="flex items-center gap-2">
                    <span className="w-12 shrink-0 text-right text-xs text-gray-600">
                      {record.year}年目
                    </span>
                    <div className="relative flex flex-1 items-center">
                      <div
                        className="h-6 rounded-l bg-primary-400"
                        style={{ width: `${Math.max(principalPct, 0)}%` }}
                      />
                      {returnPct > 0 && (
                        <div
                          className="h-6 rounded-r bg-accent-400"
                          style={{ width: `${returnPct}%` }}
                        />
                      )}
                    </div>
                    <span className="w-24 shrink-0 text-right text-xs font-medium text-gray-700">
                      {formatMoney(record.totalAssets)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 年次データテーブル */}
          <div
            className="card overflow-x-auto"
            role="region"
            aria-label="年次データテーブル（横スクロール可能）"
            tabIndex={0}
          >
            <h2 className="text-lg font-bold text-gray-800">年次データ</h2>
            <p className="mt-1 text-xs text-gray-600 sm:hidden">
              ← 横スクロールで全列を表示 →
            </p>
            <table
              className="mt-4 w-full text-sm"
              aria-label="複利計算シミュレーション年次データ"
            >
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th scope="col" className="pb-2 pr-4">
                    年数
                  </th>
                  <th scope="col" className="pb-2 pr-4 text-right">
                    投資元本
                  </th>
                  <th scope="col" className="pb-2 pr-4 text-right">
                    運用益
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    合計資産
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.records.map((record) => (
                  <tr
                    key={record.year}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-2 pr-4 text-gray-700">
                      {record.year}年目
                    </td>
                    <td className="py-2 pr-4 text-right text-gray-600">
                      {formatMoney(record.principal)}
                    </td>
                    <td className="py-2 pr-4 text-right font-medium text-accent-700">
                      {record.investmentReturn > 0
                        ? `+${formatMoney(record.investmentReturn)}`
                        : "-"}
                    </td>
                    <td className="py-2 text-right font-medium text-gray-800">
                      {formatMoney(record.totalAssets)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 複利の力コラム */}
          <div className="card bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">
              複利の力とは？
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700">
              <p>
                複利とは、運用で得た利益を再投資することで「利益が利益を生む」仕組みです。
                単利（元本のみに利息がつく）と比べ、長期間になるほど資産の増え方が加速します。
              </p>
              <p>
                例えば毎月5万円を年利5%で20年間積立てると、投資元本1,200万円に対し、
                運用益は約{formatMoney(calcCompound(0, 5, 0.05, 20).totalReturn)}になります。
                運用期間が長いほど複利効果は大きくなるため、
                <strong>早く始めることが最大のアドバンテージ</strong>です。
              </p>
            </div>
          </div>

          {/* FIRE CTA */}
          <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
            <p className="text-lg font-bold text-primary-800">
              この資産でFIREできる？
            </p>
            <p className="mt-1 text-sm text-primary-700">
              積立投資の成果を活かして、経済的自立（FIRE）の達成年を計算してみましょう
            </p>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/simulate/"
                className="btn-primary inline-block text-lg"
              >
                FIREシミュレーションへ
              </Link>
              <Link
                href="/diagnose/"
                className="inline-block rounded-lg border border-accent-300 bg-white px-5 py-2.5 text-sm font-medium text-accent-700 transition hover:bg-accent-50"
              >
                FIRE診断を受ける（無料・1分）
              </Link>
            </div>
          </div>
        </div>
      )}

      <RelatedContent
        items={[
          {
            href: "/simulate/",
            title: "FIREシミュレーション",
            description: "地域・年収・家族構成から必要資産と達成年を計算",
          },
          {
            href: "/withdraw/",
            title: "取り崩しシミュレーション",
            description:
              "FIRE後、資産を取り崩して何歳まで持つかを計算",
          },
          {
            href: "/guide/fire-index-investing/",
            title: "インデックス投資入門",
            description: "FIRE向けの銘柄選びから出口戦略まで解説",
          },
          {
            href: "/guide/nisa-ideco-for-fire/",
            title: "新NISA・iDeCoの活用法",
            description: "非課税枠を最大限活用して資産形成を加速",
          },
          {
            href: "/diagnose/",
            title: "FIRE達成度診断",
            description: "6つの質問であなたのFIREグレードを判定",
          },
        ]}
      />

      {/* 証券口座CTA */}
      <BrokerCtaSection
        heading="積立投資を始めるなら、まず証券口座を開設"
        description="新NISAなら運用益が非課税。複利効果を最大限に活かせます"
        className="mt-6"
      />
    </div>
  );
}
