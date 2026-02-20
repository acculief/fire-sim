"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { SimulationResult } from "@/lib/types";
import { formatMoney, formatPercent, formatYearDiff } from "@/lib/format";
import { SITE_URL } from "@/config/site";
import { prefectures, type Prefecture } from "@/data/prefectures";
import { brokers } from "@/data/recommend";
import BrokerCard from "@/components/BrokerCard";
import ShareButtons from "@/components/ShareButtons";
import {
  estimateMonthlyExpense,
  calcFireNumber,
  calcEffectiveYieldRate,
  inputToParams,
} from "@/lib/calculator";

const affiliateBrokers = brokers.filter((b) => b.isAffiliate);

const AssetChart = dynamic(() => import("./AssetChart"), {
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center sm:h-80" role="status" aria-live="polite">
      <p className="text-sm text-gray-500">グラフを読み込み中...</p>
    </div>
  ),
  ssr: false,
});

interface Props {
  result: SimulationResult;
}

export default function ResultDisplay({ result }: Props) {
  const { scenarios, sensitivity } = result;
  const neutral = scenarios.neutral;
  // OGP画像つきシェアURL
  const ogShareUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("pref", result.prefectureName);
    params.set("fire", String(neutral.fireNumber));
    if (neutral.achievementAge !== null) params.set("age", String(neutral.achievementAge));
    params.set("expense", String(neutral.monthlyExpense));
    params.set("strategy", result.input.fireStrategy);
    return `${SITE_URL}/result/?${params.toString()}`;
  }, [result, neutral]);

  // --- 移住比較ロジック ---
  const migrationComparisons = useMemo(() => {
    const {
      familyType,
      housingType,
      fireStrategy,
      swr,
      yieldRate,
      dividendTaxRate,
    } = result.input;
    const currentCostIndex = result.costIndex;
    const currentPrefCode = result.input.prefecture;
    const postFireMonthlyCost = result.postFireMonthlyCost;

    // 現在の月間支出・FIRE資産（neutralベース）
    const currentMonthlyExpense = neutral.monthlyExpense;
    const currentFireNumber = neutral.fireNumber;

    // 候補を選ぶヘルパー: 同地域 / costIndex帯 / 予算帯
    const currentPref = prefectures.find((p) => p.code === currentPrefCode);
    const currentRegion = currentPref?.region ?? "";

    // costIndex >= 1.0 の場合（都市部在住）
    // 1) 同地域の安い県  2) 中コスト帯 ~0.90  3) 低コスト帯 ~0.85
    // costIndex < 1.0 の場合（地方在住）
    // 1) 東京 (1.25) をコントラスト  2) やや安い県  3) 最安帯
    function pickDestinations(): Prefecture[] {
      const candidates = prefectures.filter(
        (p) => p.code !== currentPrefCode,
      );
      const destinations: Prefecture[] = [];

      if (currentCostIndex >= 1.0) {
        // 1. 同地域で安い県
        const sameRegionCheaper = candidates
          .filter(
            (p) => p.region === currentRegion && p.costIndex < currentCostIndex,
          )
          .sort((a, b) => a.costIndex - b.costIndex);
        if (sameRegionCheaper.length > 0) {
          destinations.push(sameRegionCheaper[0]);
        } else {
          // 同地域に安いのがなければ、近いcostIndexで別地域
          const nearby = candidates
            .filter((p) => p.costIndex >= 0.90 && p.costIndex < 0.95)
            .sort(
              (a, b) =>
                Math.abs(a.costIndex - 0.92) - Math.abs(b.costIndex - 0.92),
            );
          if (nearby.length > 0) destinations.push(nearby[0]);
        }

        // 2. 中コスト帯 (~0.90)
        const medium = candidates
          .filter(
            (p) =>
              p.costIndex >= 0.88 &&
              p.costIndex <= 0.92 &&
              !destinations.some((d) => d.code === p.code),
          )
          .sort(
            (a, b) =>
              Math.abs(a.costIndex - 0.90) - Math.abs(b.costIndex - 0.90),
          );
        if (medium.length > 0) destinations.push(medium[0]);

        // 3. 低コスト帯 (~0.85)
        const budget = candidates
          .filter(
            (p) =>
              p.costIndex <= 0.86 &&
              !destinations.some((d) => d.code === p.code),
          )
          .sort((a, b) => a.costIndex - b.costIndex);
        if (budget.length > 0) destinations.push(budget[0]);
      } else {
        // 地方在住
        // 1. 東京をコントラストとして
        const tokyo = candidates.find((p) => p.code === "tokyo");
        if (tokyo) destinations.push(tokyo);

        // 2. やや安い県（自分より安い）
        const slightlyCheaper = candidates
          .filter(
            (p) =>
              p.costIndex < currentCostIndex &&
              !destinations.some((d) => d.code === p.code),
          )
          .sort((a, b) => b.costIndex - a.costIndex);
        if (slightlyCheaper.length > 0) destinations.push(slightlyCheaper[0]);

        // 3. 最安帯
        const cheapest = candidates
          .filter(
            (p) =>
              p.costIndex <= 0.85 &&
              !destinations.some((d) => d.code === p.code),
          )
          .sort((a, b) => a.costIndex - b.costIndex);
        if (cheapest.length > 0) destinations.push(cheapest[0]);
      }

      return destinations.slice(0, 3);
    }

    const destinations = pickDestinations();

    // 各移住先のFIRE数値を計算
    return destinations.map((dest) => {
      // 生活費の推定
      const destBaseExpense = estimateMonthlyExpense(
        dest.costIndex,
        familyType,
        housingType,
      );
      const destMonthlyExpense =
        Math.round((destBaseExpense + postFireMonthlyCost) * 10) / 10;
      const destAnnualExpense = destMonthlyExpense * 12;

      // FIRE必要資産をストラテジーに応じて計算
      let destFireNumber: number;
      if (fireStrategy === "yield") {
        const effectiveRate = calcEffectiveYieldRate(yieldRate, dividendTaxRate);
        destFireNumber =
          effectiveRate > 0 ? destAnnualExpense / effectiveRate : Infinity;
      } else {
        destFireNumber = calcFireNumber(destAnnualExpense, swr);
      }
      destFireNumber = Math.round(destFireNumber);

      // 差額
      const fireNumberDiff = destFireNumber - currentFireNumber;
      const monthlyDiff =
        Math.round((destMonthlyExpense - currentMonthlyExpense) * 10) / 10;

      return {
        prefecture: dest,
        monthlyExpense: destMonthlyExpense,
        fireNumber: destFireNumber,
        fireNumberDiff,
        monthlyDiff,
      };
    });
  }, [result, neutral]);

  return (
    <div className="space-y-6">
      {/* ヘッドライン */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="text-center">
          <p className="text-sm text-primary-700">
            {result.prefectureName}・{result.familyLabel}・{result.housingLabel}
            <span className="ml-2 inline-block rounded-full bg-primary-200 px-2 py-0.5 text-xs font-medium text-primary-800">
              {result.strategyLabel}
            </span>
          </p>
          <p className="mt-2 text-3xl font-bold text-primary-800">
            FIRE必要資産：{formatMoney(neutral.fireNumber)}
          </p>
          <p className="mt-1 text-lg text-primary-700">
            {neutral.achievementAge !== null ? (
              <>
                達成年齢：
                <span className="font-bold">{neutral.achievementAge}歳</span>
                （あと{neutral.achievementYears}年）
              </>
            ) : (
              <span className="text-orange-600">
                現在の条件では達成が難しい見込みです
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            月間支出：{neutral.monthlyExpense}万円
            <span className="ml-1 text-xs text-gray-600">
              （生活費{result.baseMonthlyExpense}万円
              {result.input.customMonthlyExpense != null && result.input.customMonthlyExpense > 0
                ? " 手入力"
                : ""}
              ＋社会保険{result.postFireMonthlyCost}万円）
            </span>
          </p>
        </div>
      </div>

      {/* シナリオ比較表 */}
      <div className="card">
        <h3 className="mb-4 text-lg font-bold text-gray-800">
          シナリオ比較
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="pb-2 text-left font-medium text-gray-500">
                  項目
                </th>
                {(["optimistic", "neutral", "pessimistic"] as const).map(
                  (key) => (
                    <th
                      key={key}
                      scope="col"
                      className="pb-2 text-right font-medium"
                      style={{ color: scenarios[key].color }}
                    >
                      {scenarios[key].label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 text-gray-600">必要資産</td>
                {(["optimistic", "neutral", "pessimistic"] as const).map(
                  (key) => (
                    <td key={key} className="py-2 text-right font-medium">
                      {formatMoney(scenarios[key].fireNumber)}
                    </td>
                  ),
                )}
              </tr>
              <tr>
                <td className="py-2 text-gray-600">月間生活費</td>
                {(["optimistic", "neutral", "pessimistic"] as const).map(
                  (key) => (
                    <td key={key} className="py-2 text-right">
                      {scenarios[key].monthlyExpense}万円
                    </td>
                  ),
                )}
              </tr>
              <tr>
                <td className="py-2 text-gray-600">達成年齢</td>
                {(["optimistic", "neutral", "pessimistic"] as const).map(
                  (key) => (
                    <td key={key} className="py-2 text-right font-medium">
                      {scenarios[key].achievementAge !== null
                        ? `${scenarios[key].achievementAge}歳`
                        : "ー"}
                    </td>
                  ),
                )}
              </tr>
              <tr>
                <td className="py-2 text-gray-600">達成年数</td>
                {(["optimistic", "neutral", "pessimistic"] as const).map(
                  (key) => (
                    <td key={key} className="py-2 text-right">
                      {scenarios[key].achievementYears !== null
                        ? `${scenarios[key].achievementYears}年`
                        : "ー"}
                    </td>
                  ),
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* グラフ */}
      <div className="card">
        <h3 className="mb-4 text-lg font-bold text-gray-800">
          資産推移グラフ
        </h3>
        <AssetChart scenarios={scenarios} />
      </div>

      {/* 感度分析 */}
      <div className="card">
        <h3 className="mb-4 text-lg font-bold text-gray-800">
          感度分析（もし〇〇したら？）
        </h3>
        <div className="space-y-3">
          {sensitivity.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div>
                <p className="font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
              <div className="text-right">
                {item.diff !== null ? (
                  <span
                    className={`text-lg font-bold ${
                      item.diff < 0
                        ? "text-green-600"
                        : item.diff > 0
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {formatYearDiff(item.diff)}
                  </span>
                ) : (
                  <span className="text-gray-500">ー</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 前提条件 */}
      <div className="card">
        <h3 className="mb-4 text-lg font-bold text-gray-800">前提条件</h3>
        <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-500">地域</dt>
            <dd className="font-medium">
              {result.prefectureName}（係数 {result.costIndex}）
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">家族構成</dt>
            <dd className="font-medium">{result.familyLabel}</dd>
          </div>
          <div>
            <dt className="text-gray-500">住宅</dt>
            <dd className="font-medium">{result.housingLabel}</dd>
          </div>
          <div>
            <dt className="text-gray-500">FIREタイプ</dt>
            <dd className="font-medium">{result.strategyLabel}</dd>
          </div>
          <div>
            <dt className="text-gray-500">想定利回り</dt>
            <dd className="font-medium">
              {formatPercent(result.input.annualReturnRate)}
            </dd>
          </div>
          {result.input.fireStrategy === "withdrawal" ? (
            <div>
              <dt className="text-gray-500">取り崩し率（SWR）</dt>
              <dd className="font-medium">{formatPercent(result.input.swr)}</dd>
            </div>
          ) : (
            <>
              <div>
                <dt className="text-gray-500">配当利回り（税引前）</dt>
                <dd className="font-medium">{formatPercent(result.input.yieldRate)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">税引後利回り</dt>
                <dd className="font-medium text-primary-700">
                  {result.effectiveYieldRate !== null
                    ? formatPercent(result.effectiveYieldRate)
                    : "ー"}
                </dd>
              </div>
            </>
          )}
          <div>
            <dt className="text-gray-500">運用益の税率</dt>
            <dd className="font-medium">
              {formatPercent(result.input.dividendTaxRate)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">FIRE後 社会保険料</dt>
            <dd className="font-medium">
              月{result.postFireMonthlyCost}万円
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">物価上昇率</dt>
            <dd className="font-medium">
              {formatPercent(result.input.inflationRate)}
            </dd>
          </div>
        </dl>
      </div>

      {/* ストーリー型CTA */}
      {(() => {
        const shortfall = neutral.fireNumber - result.input.currentAssets;
        const comparisonYears = neutral.achievementYears ?? 20;
        const monthlyAmount = result.input.monthlyInvestment;
        const savingsOnly = monthlyAmount * 12 * comparisonYears;
        const withInvesting =
          monthlyAmount *
          12 *
          ((Math.pow(1 + 0.04 / 12, comparisonYears * 12) - 1) / (0.04 / 12));
        const investmentGain = Math.round(withInvesting - savingsOnly);
        const isAchievable = neutral.achievementAge !== null;

        return (
          <>
            <div className="card border-primary-300 bg-gradient-to-br from-primary-50 to-accent-50">
              <h3 className="mb-4 text-lg font-bold text-primary-800">
                FIRE達成に向けて、今やるべきこと
              </h3>

              <div className="space-y-5">
                {/* ① 現実を見せる */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Step 1
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    現在地を確認する
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    {isAchievable ? (
                      <>
                        目標資産{" "}
                        <strong className="text-primary-700">
                          {formatMoney(neutral.fireNumber)}
                        </strong>
                        に対し、現在の資産は{formatMoney(result.input.currentAssets)}。あと{" "}
                        <strong className="text-primary-700">
                          {formatMoney(shortfall)}
                        </strong>{" "}
                        の積み上げが必要です。
                      </>
                    ) : (
                      <>
                        現在の条件では目標達成が難しい結果になりました。
                        目標資産{" "}
                        <strong className="text-primary-700">
                          {formatMoney(neutral.fireNumber)}
                        </strong>
                        に対し、現在の資産は{formatMoney(result.input.currentAssets)}。
                        積立額を増やすか、支出の見直しを検討しましょう。
                      </>
                    )}
                  </p>
                </div>

                {/* ② 危機感を出す */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Step 2
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    「預金だけ」のリスクを知る
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-lg bg-gray-100 p-3">
                      <p className="text-xs text-gray-600">
                        銀行預金のみ（{comparisonYears}年）
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-600">
                        {formatMoney(Math.round(savingsOnly))}
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary-100 p-3">
                      <p className="text-xs text-primary-600">
                        年利4%で運用（{comparisonYears}年）
                      </p>
                      <p className="mt-1 text-lg font-bold text-primary-700">
                        {formatMoney(Math.round(withInvesting))}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">
                    同じ月{monthlyAmount}万円でも、{comparisonYears}年後の差は{" "}
                    <strong className="text-primary-700">
                      {formatMoney(investmentGain)}
                    </strong>
                    。銀行預金だけでは物価上昇に負けてしまいます。
                  </p>
                </div>

                {/* ③ 解決策を提示 */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Step 3
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    新NISAで非課税運用を始める
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    新NISAを活用すれば、運用益にかかる約20%の税金が非課税に。
                    {monthlyAmount <= 30 ? (
                      <>
                        毎月{monthlyAmount}万円の積立なら、新NISAの枠内で始められます。
                      </>
                    ) : (
                      <>
                        まずは新NISAのつみたて投資枠（月10万円）から始めましょう。
                      </>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    ※ 新NISA：年間360万円（つみたて投資枠120万円＋成長投資枠240万円）まで非課税
                  </p>
                </div>
              </div>
            </div>

            {/* ④ 具体的な一歩 — BrokerCard */}
            {affiliateBrokers.length > 0 && (
              <div className="card border-primary-300">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Step 4
                </p>
                <h3 className="text-lg font-bold text-primary-800">
                  まず口座を開設する
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  口座開設は無料・最短即日。まず行動を始めましょう。
                </p>
                <div className="mt-4 space-y-3">
                  {affiliateBrokers.map((b) => (
                    <BrokerCard key={b.slug} broker={b} />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href="/recommend/"
                    className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-800"
                  >
                    他の証券口座・おすすめ書籍も見る →
                  </Link>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* 移住比較 */}
      {migrationComparisons.length > 0 && (
        <div className="card">
          <h3 className="mb-1 text-lg font-bold text-gray-800">
            もし移住したら？
          </h3>
          <p className="mb-4 text-xs text-gray-600">
            同じ条件で別の地域に住んだ場合のFIRE必要資産を比較
          </p>

          {/* 現在地ヘッダ */}
          <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-primary-800">
                  {result.prefectureName}（現在）
                </p>
                <p className="text-xs text-primary-600">
                  物価係数 {result.costIndex}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  月{neutral.monthlyExpense}万円
                </p>
                <p className="text-base font-bold text-primary-800">
                  {formatMoney(neutral.fireNumber)}
                </p>
              </div>
            </div>
          </div>

          {/* 比較カード */}
          <div className="space-y-2">
            {migrationComparisons.map((comp) => (
              <div
                key={comp.prefecture.code}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {comp.prefecture.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      物価係数 {comp.prefecture.costIndex}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      月{comp.monthlyExpense}万円
                      <span
                        className={`ml-1 text-xs font-medium ${
                          comp.monthlyDiff < 0
                            ? "text-green-600"
                            : comp.monthlyDiff > 0
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        ({comp.monthlyDiff > 0 ? "+" : ""}
                        {comp.monthlyDiff}万円)
                      </span>
                    </p>
                    <p className="text-base font-bold text-gray-800">
                      {formatMoney(comp.fireNumber)}
                      <span
                        className={`ml-1 text-xs font-medium ${
                          comp.fireNumberDiff < 0
                            ? "text-green-600"
                            : comp.fireNumberDiff > 0
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        ({comp.fireNumberDiff > 0 ? "+" : ""}
                        {formatMoney(Math.abs(comp.fireNumberDiff))}
                        {comp.fireNumberDiff < 0 ? "減" : comp.fireNumberDiff > 0 ? "増" : ""})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/fire/${comp.prefecture.code}/`}
                    className="inline-flex min-h-[44px] items-center rounded bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    {comp.prefecture.name}のFIRE情報
                  </Link>
                  <Link
                    href={`/simulate/?${inputToParams({ ...result.input, prefecture: comp.prefecture.code })}`}
                    className="inline-flex min-h-[44px] items-center rounded bg-primary-100 px-3 py-2 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-200"
                  >
                    移住先でシミュレーション
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 関連ガイド・おすすめ */}
      <div className="card">
        <h3 className="mb-3 text-lg font-bold text-gray-800">
          もっと詳しく知る
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            href="/guide/4percent-rule/"
            className="rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">4%ルール（SWR）徹底解説</p>
            <p className="mt-0.5 text-xs text-gray-600">
              取り崩し率の根拠と注意点
            </p>
          </Link>
          <Link
            href="/guide/fire-index-investing/"
            className="rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">インデックス投資入門</p>
            <p className="mt-0.5 text-xs text-gray-600">
              FIRE達成の王道戦略を解説
            </p>
          </Link>
          <Link
            href="/recommend/"
            className="rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm transition-colors hover:border-primary-300"
          >
            <p className="font-bold text-primary-800">
              おすすめ証券口座・書籍
            </p>
            <p className="mt-0.5 text-xs text-primary-600">
              FIRE達成に役立つツールを厳選
            </p>
          </Link>
          <Link
            href="/guide/"
            className="rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">FIREガイド一覧</p>
            <p className="mt-0.5 text-xs text-gray-600">
              20本以上の解説記事を公開中
            </p>
          </Link>
        </div>
      </div>

      {/* 共有 */}
      <div className="card text-center">
        <p className="mb-3 text-sm font-medium text-gray-700">
          結果をシェアする
        </p>
        <ShareButtons
          text={
            neutral.achievementAge !== null
              ? `私のFIRE達成予定は${neutral.achievementAge}歳！（必要資産：${formatMoney(neutral.fireNumber)}）`
              : `FIRE必要資産：${formatMoney(neutral.fireNumber)}`
          }
          url={ogShareUrl}
        />
      </div>

      {/* 免責 */}
      <div className="rounded-lg bg-gray-100 p-4 text-xs text-gray-600">
        <p className="font-medium">免責事項</p>
        <p className="mt-1">
          本シミュレーションは概算であり、投資助言・税務助言ではありません。
          実際の投資成果や税負担は市場環境・個人の状況により大きく異なります。
          投資判断はご自身の責任で行ってください。
          計算には簡易的な係数を使用しており、実際の生活費とは乖離する場合があります。
        </p>
      </div>
    </div>
  );
}
