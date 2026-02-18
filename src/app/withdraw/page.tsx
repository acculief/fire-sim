"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedContent from "@/components/RelatedContent";
import NumberInput from "@/components/NumberInput";
import { formatMoney } from "@/lib/format";
import { brokers } from "@/data/recommend";
import BrokerCard from "@/components/BrokerCard";

const affiliateBrokers = brokers.filter((b) => b.isAffiliate);

/* ------------------------------------------------------------------ */
/*  型定義                                                              */
/* ------------------------------------------------------------------ */

interface YearlyRecord {
  age: number;
  assets: number;
  withdrawal: number;
  investmentReturn: number;
}

interface WithdrawalResult {
  records: YearlyRecord[];
  depletionAge: number | null;
  yearsLasted: number;
  effectiveRate: number;
}

/* ------------------------------------------------------------------ */
/*  計算ロジック                                                        */
/* ------------------------------------------------------------------ */

function calcWithdrawal(
  initialAssets: number,
  monthlyWithdrawal: number,
  annualReturn: number,
  inflationRate: number,
  startAge: number,
  maxAge: number = 100,
): WithdrawalResult {
  const records: YearlyRecord[] = [];
  let assets = initialAssets;
  let depletionAge: number | null = null;
  const annualWithdrawalBase = monthlyWithdrawal * 12;

  // 初年度（取り崩し前）
  records.push({
    age: startAge,
    assets: Math.round(assets),
    withdrawal: 0,
    investmentReturn: 0,
  });

  for (let year = 1; year <= maxAge - startAge; year++) {
    const age = startAge + year;
    const investmentReturn = assets * annualReturn;
    const adjustedWithdrawal =
      annualWithdrawalBase * Math.pow(1 + inflationRate, year);

    assets = assets + investmentReturn - adjustedWithdrawal;

    if (assets <= 0) {
      records.push({
        age,
        assets: 0,
        withdrawal: Math.round(adjustedWithdrawal),
        investmentReturn: Math.round(investmentReturn),
      });
      depletionAge = age;
      break;
    }

    records.push({
      age,
      assets: Math.round(assets),
      withdrawal: Math.round(adjustedWithdrawal),
      investmentReturn: Math.round(investmentReturn),
    });
  }

  const yearsLasted = depletionAge
    ? depletionAge - startAge
    : maxAge - startAge;
  const effectiveRate = (annualWithdrawalBase / initialAssets) * 100;

  return { records, depletionAge, yearsLasted, effectiveRate };
}

/* ------------------------------------------------------------------ */
/*  コンポーネント                                                      */
/* ------------------------------------------------------------------ */

export default function WithdrawPage() {
  const [initialAssets, setInitialAssets] = useState(7500);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(25);
  const [annualReturn, setAnnualReturn] = useState(3);
  const [inflationRate, setInflationRate] = useState(1);
  const [startAge, setStartAge] = useState(45);
  const [result, setResult] = useState<WithdrawalResult | null>(null);

  const handleSimulate = useCallback(() => {
    const res = calcWithdrawal(
      initialAssets,
      monthlyWithdrawal,
      annualReturn / 100,
      inflationRate / 100,
      startAge,
    );
    setResult(res);

    setTimeout(() => {
      document
        .getElementById("withdraw-result")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [initialAssets, monthlyWithdrawal, annualReturn, inflationRate, startAge]);

  // 5年ごとのバーチャート用データ
  const chartData = result
    ? result.records.filter(
        (r, i) => i === 0 || (r.age - startAge) % 5 === 0 || r.assets === 0,
      )
    : [];
  const maxChartAssets = result
    ? Math.max(...result.records.map((r) => r.assets), 1)
    : 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "取り崩しシミュレーション" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        取り崩しシミュレーション
      </h1>
      <p className="mt-2 text-gray-600">
        FIRE達成後、資産を取り崩しながら何歳まで資産が持つかをシミュレーションします。
      </p>

      {/* 入力フォーム */}
      <div className="card mt-6">
        <h2 className="text-lg font-bold text-gray-800">条件を入力</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="initialAssets"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              初期資産（万円）
            </label>
            <NumberInput
              id="initialAssets"
              className="input-field"
              value={initialAssets}
              onValueChange={setInitialAssets}
              min={100}
              step={100}
            />
          </div>
          <div>
            <label
              htmlFor="monthlyWithdrawal"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              毎月の取り崩し額（万円）
            </label>
            <NumberInput
              id="monthlyWithdrawal"
              className="input-field"
              value={monthlyWithdrawal}
              onValueChange={setMonthlyWithdrawal}
              min={1}
              step={1}
            />
          </div>
          <div>
            <label
              htmlFor="annualReturn"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              想定運用利回り（年率%）
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
              htmlFor="inflationRate"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              インフレ率（年率%）
            </label>
            <NumberInput
              id="inflationRate"
              className="input-field"
              value={inflationRate}
              onValueChange={setInflationRate}
              min={0}
              max={10}
              step={0.5}
            />
          </div>
          <div>
            <label
              htmlFor="startAge"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              現在の年齢
            </label>
            <NumberInput
              id="startAge"
              className="input-field"
              value={startAge}
              onValueChange={setStartAge}
              min={20}
              max={80}
            />
          </div>
        </div>
        <button className="btn-primary mt-6 w-full" onClick={handleSimulate}>
          シミュレーション開始
        </button>
      </div>

      {/* 結果表示 */}
      {result && (
        <div id="withdraw-result" className="mt-8 space-y-6">
          {/* ヘッドラインカード */}
          <div className="card">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-sm text-gray-500">資産が尽きる年齢</p>
                <p className="mt-1 text-3xl font-bold text-primary-700">
                  {result.depletionAge
                    ? `${result.depletionAge}歳`
                    : "100歳まで維持可能"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">資産維持年数</p>
                <p className="mt-1 text-3xl font-bold text-gray-800">
                  {result.yearsLasted}
                  <span className="text-lg">年</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">実質取り崩し率</p>
                <p className="mt-1 text-3xl font-bold text-gray-800">
                  {result.effectiveRate.toFixed(1)}
                  <span className="text-lg">%</span>
                </p>
              </div>
            </div>
            {!result.depletionAge && (
              <p className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
                この条件では100歳まで資産を維持できます。4%ルールの範囲内です。
              </p>
            )}
            {result.depletionAge && result.depletionAge < 80 && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
                資産が早期に枯渇するリスクがあります。取り崩し額の見直しや運用利回りの改善を検討してください。
              </p>
            )}
          </div>

          {/* バーチャート */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800">資産推移</h2>
            <div className="mt-4 space-y-2">
              {chartData.map((record) => {
                const pct = Math.round(
                  (record.assets / maxChartAssets) * 100,
                );
                const ratio = record.assets / initialAssets;
                let barColor = "bg-green-500";
                if (ratio <= 0.25) barColor = "bg-red-500";
                else if (ratio <= 0.5) barColor = "bg-yellow-500";

                return (
                  <div
                    key={record.age}
                    className="flex items-center gap-2"
                  >
                    <span className="w-12 shrink-0 text-right text-xs text-gray-500">
                      {record.age}歳
                    </span>
                    <div className="relative flex-1">
                      <div
                        className={`h-6 rounded transition-all ${barColor}`}
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                    <span className="w-24 shrink-0 text-right text-xs font-medium text-gray-700">
                      {formatMoney(record.assets)}
                    </span>
                  </div>
                );
              })}
              {/* 0ライン */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-12 shrink-0" />
                <div className="h-px flex-1 border-t border-dashed border-gray-300" />
                <span className="w-24 shrink-0 text-right">0万円</span>
              </div>
            </div>
          </div>

          {/* 年次データテーブル */}
          <div className="card overflow-x-auto">
            <h2 className="text-lg font-bold text-gray-800">年次データ</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 pr-4">年齢</th>
                  <th className="pb-2 pr-4 text-right">残高</th>
                  <th className="pb-2 pr-4 text-right">年間取り崩し</th>
                  <th className="pb-2 text-right">運用益</th>
                </tr>
              </thead>
              <tbody>
                {result.records.map((record) => (
                  <tr
                    key={record.age}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-2 pr-4 text-gray-700">
                      {record.age}歳
                    </td>
                    <td className="py-2 pr-4 text-right font-medium text-gray-800">
                      {formatMoney(record.assets)}
                    </td>
                    <td className="py-2 pr-4 text-right text-gray-600">
                      {record.withdrawal > 0
                        ? formatMoney(record.withdrawal)
                        : "-"}
                    </td>
                    <td className="py-2 text-right text-gray-600">
                      {record.investmentReturn > 0
                        ? formatMoney(record.investmentReturn)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RelatedContent
        items={[
          {
            href: "/simulate/",
            title: "FIREシミュレーション",
            description:
              "地域・年収・家族構成から必要資産を計算",
          },
          {
            href: "/guide/4percent-rule/",
            title: "4%ルール",
            description:
              "FIRE後の取り崩し戦略の基本を解説",
          },
          {
            href: "/tracker/",
            title: "進捗トラッカー",
            description:
              "毎月の資産を記録して達成度を可視化",
          },
          {
            href: "/guide/fire-index-investing/",
            title: "インデックス投資",
            description:
              "資産を増やすための投資戦略ガイド",
          },
        ]}
      />

      {/* CTA */}
      <div className="mt-8 rounded-lg border border-primary-200 bg-primary-50 p-6 text-center">
        <p className="font-bold text-primary-800">
          FIRE達成に必要な資産を知りたい？
        </p>
        <p className="mt-1 text-sm text-primary-700">
          シミュレーションで、あなたに必要なFIRE資産を計算しましょう
        </p>
        <Link
          href="/simulate/"
          className="btn-primary mt-3 inline-block"
        >
          FIREシミュレーションへ
        </Link>
      </div>

      {/* 証券口座CTA */}
      {affiliateBrokers.length > 0 && (
        <div className="mt-6 rounded-xl border-2 border-accent-200 bg-accent-50 p-6">
          <h3 className="mb-1 text-center text-lg font-bold text-accent-800">
            FIRE後の取り崩しに備えて証券口座を準備しよう
          </h3>
          <p className="mb-4 text-center text-xs text-gray-600">
            新NISAを活用すれば取り崩し時も非課税。まずは口座開設から始めましょう
          </p>
          <div className="space-y-3">
            {affiliateBrokers.map((b) => (
              <BrokerCard key={b.slug} broker={b} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/guide/how-to-choose-broker/" className="text-accent-700 underline hover:text-accent-600">
              証券口座の選び方ガイド
            </Link>
            <Link href="/guide/nisa-fire-acceleration/" className="text-accent-700 underline hover:text-accent-600">
              新NISAでFIRE加速
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
