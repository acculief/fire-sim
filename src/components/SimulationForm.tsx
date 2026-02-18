"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { prefectures } from "@/data/prefectures";
import {
  DEFAULTS,
  FAMILY_COEFFICIENTS,
  HOUSING_COEFFICIENTS,
  FIRE_STRATEGIES,
  estimatePostFireMonthlyCost,
} from "@/config/assumptions";
import type { SimulationInput, FireStrategy } from "@/lib/types";
import NumberInput from "@/components/NumberInput";

// 静的データなのでモジュールスコープで1回だけ計算
const regions = Array.from(new Set(prefectures.map((p) => p.region)));

interface Props {
  initialInput?: Partial<SimulationInput>;
  onSubmit: (input: SimulationInput) => void;
}

export default function SimulationForm({ initialInput, onSubmit }: Props) {
  const [prefecture, setPrefecture] = useState(
    initialInput?.prefecture ?? DEFAULTS.prefecture,
  );
  const [annualIncome, setAnnualIncome] = useState(
    initialInput?.annualIncome ?? DEFAULTS.annualIncome,
  );
  const [incomeType, setIncomeType] = useState<"gross" | "net">(
    initialInput?.incomeType ?? DEFAULTS.incomeType,
  );
  const [currentAssets, setCurrentAssets] = useState(
    initialInput?.currentAssets ?? DEFAULTS.currentAssets,
  );
  const [monthlyInvestment, setMonthlyInvestment] = useState(
    initialInput?.monthlyInvestment ?? DEFAULTS.monthlyInvestment,
  );
  const [familyType, setFamilyType] = useState(
    initialInput?.familyType ?? DEFAULTS.familyType,
  );
  const [housingType, setHousingType] = useState(
    initialInput?.housingType ?? DEFAULTS.housingType,
  );
  const [currentAge, setCurrentAge] = useState(
    initialInput?.currentAge ?? DEFAULTS.currentAge,
  );
  const [targetAge, setTargetAge] = useState<number | undefined>(
    initialInput?.targetAge ?? DEFAULTS.targetAge,
  );

  const [customMonthlyExpense, setCustomMonthlyExpense] = useState<
    number | undefined
  >(initialInput?.customMonthlyExpense);

  const [fireStrategy, setFireStrategy] = useState<FireStrategy>(
    initialInput?.fireStrategy ?? DEFAULTS.fireStrategy,
  );

  const [dividendTaxRate, setDividendTaxRate] = useState(
    (initialInput?.dividendTaxRate ?? DEFAULTS.dividendTaxRate) * 100,
  );
  const [postFireMonthlyCost, setPostFireMonthlyCost] = useState<
    number | undefined
  >(initialInput?.postFireMonthlyCost);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [annualReturnRate, setAnnualReturnRate] = useState(
    (initialInput?.annualReturnRate ?? DEFAULTS.annualReturnRate) * 100,
  );
  const [swr, setSwr] = useState(
    (initialInput?.swr ?? DEFAULTS.swr) * 100,
  );
  const [yieldRate, setYieldRate] = useState(
    (initialInput?.yieldRate ?? DEFAULTS.yieldRate) * 100,
  );
  const [inflationRate, setInflationRate] = useState(
    (initialInput?.inflationRate ?? DEFAULTS.inflationRate) * 100,
  );

  // initialInput が変わったらフォーム値を同期
  useEffect(() => {
    if (!initialInput) return;
    if (initialInput.prefecture != null) setPrefecture(initialInput.prefecture);
    if (initialInput.annualIncome != null) setAnnualIncome(initialInput.annualIncome);
    if (initialInput.incomeType != null) setIncomeType(initialInput.incomeType);
    if (initialInput.currentAssets != null) setCurrentAssets(initialInput.currentAssets);
    if (initialInput.monthlyInvestment != null) setMonthlyInvestment(initialInput.monthlyInvestment);
    if (initialInput.familyType != null) setFamilyType(initialInput.familyType);
    if (initialInput.housingType != null) setHousingType(initialInput.housingType);
    if (initialInput.currentAge != null) setCurrentAge(initialInput.currentAge);
    if (initialInput.targetAge !== undefined) setTargetAge(initialInput.targetAge);
    if (initialInput.customMonthlyExpense !== undefined) setCustomMonthlyExpense(initialInput.customMonthlyExpense);
    if (initialInput.fireStrategy != null) setFireStrategy(initialInput.fireStrategy);
    if (initialInput.dividendTaxRate != null) setDividendTaxRate(initialInput.dividendTaxRate * 100);
    if (initialInput.postFireMonthlyCost !== undefined) setPostFireMonthlyCost(initialInput.postFireMonthlyCost);
    if (initialInput.annualReturnRate != null) setAnnualReturnRate(initialInput.annualReturnRate * 100);
    if (initialInput.swr != null) setSwr(initialInput.swr * 100);
    if (initialInput.yieldRate != null) setYieldRate(initialInput.yieldRate * 100);
    if (initialInput.inflationRate != null) setInflationRate(initialInput.inflationRate * 100);
  }, [initialInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      prefecture,
      annualIncome,
      incomeType,
      currentAssets,
      monthlyInvestment,
      familyType,
      housingType,
      currentAge,
      targetAge,
      annualReturnRate: annualReturnRate / 100,
      swr: swr / 100,
      inflationRate: inflationRate / 100,
      fireStrategy,
      yieldRate: yieldRate / 100,
      customMonthlyExpense: customMonthlyExpense || undefined,
      dividendTaxRate: dividendTaxRate / 100,
      postFireMonthlyCost: postFireMonthlyCost,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="FIREシミュレーション入力フォーム">
      {/* 基本情報 */}
      <fieldset className="card">
        <legend className="mb-4 text-lg font-bold text-gray-800">基本情報</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="currentAge" className="mb-1 block text-sm font-medium text-gray-700">
              現在の年齢
            </label>
            <NumberInput
              id="currentAge"
              className="input-field"
              value={currentAge}
              onValueChange={setCurrentAge}
              min={18}
              max={80}
            />
          </div>
          <div>
            <label htmlFor="targetAge" className="mb-1 block text-sm font-medium text-gray-700">
              FIRE目標年齢（任意）
            </label>
            <input
              id="targetAge"
              type="number"
              className="input-field"
              value={targetAge ?? ""}
              onChange={(e) =>
                setTargetAge(e.target.value ? Number(e.target.value) : undefined)
              }
              min={currentAge + 1}
              max={100}
              placeholder="例: 50"
            />
          </div>
        </div>
      </fieldset>

      {/* 収入・資産 */}
      <fieldset className="card">
        <legend className="mb-4 text-lg font-bold text-gray-800">収入・資産</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="annualIncome" className="mb-1 block text-sm font-medium text-gray-700">
              年収（万円）
            </label>
            <NumberInput
              id="annualIncome"
              className="input-field"
              value={annualIncome}
              onValueChange={setAnnualIncome}
              min={0}
              step={10}
            />
            <fieldset className="mt-2 flex gap-3">
              <legend className="sr-only">年収の種類</legend>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="incomeType"
                  value="gross"
                  checked={incomeType === "gross"}
                  onChange={() => setIncomeType("gross")}
                  className="text-primary-600"
                />
                額面
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="incomeType"
                  value="net"
                  checked={incomeType === "net"}
                  onChange={() => setIncomeType("net")}
                  className="text-primary-600"
                />
                手取り
              </label>
            </fieldset>
            <p className="mt-1 text-xs text-gray-400">
              <Link href="/income/" className="text-primary-500 hover:underline">
                手取り早見表で確認 →
              </Link>
            </p>
          </div>
          <div>
            <label htmlFor="currentAssets" className="mb-1 block text-sm font-medium text-gray-700">
              現在の金融資産（万円）
            </label>
            <NumberInput
              id="currentAssets"
              className="input-field"
              value={currentAssets}
              onValueChange={setCurrentAssets}
              min={0}
              step={10}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="monthlyInvestment" className="mb-1 block text-sm font-medium text-gray-700">
              毎月の積立投資額（万円）
            </label>
            <NumberInput
              id="monthlyInvestment"
              className="input-field"
              value={monthlyInvestment}
              onValueChange={setMonthlyInvestment}
              min={0}
              step={1}
            />
          </div>
        </div>
      </fieldset>

      {/* 生活スタイル */}
      <fieldset className="card">
        <legend className="mb-4 text-lg font-bold text-gray-800">生活スタイル</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="prefecture" className="mb-1 block text-sm font-medium text-gray-700">
              居住地域
            </label>
            <select
              id="prefecture"
              className="input-field"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
            >
              {regions.map((region) => (
                <optgroup key={region} label={region}>
                  {prefectures
                    .filter((p) => p.region === region)
                    .map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}（係数 {p.costIndex}）
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="familyType" className="mb-1 block text-sm font-medium text-gray-700">
              家族構成
            </label>
            <select
              id="familyType"
              className="input-field"
              value={familyType}
              onChange={(e) => setFamilyType(e.target.value)}
            >
              {Object.entries(FAMILY_COEFFICIENTS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="housingType" className="mb-1 block text-sm font-medium text-gray-700">
              住宅
            </label>
            <select
              id="housingType"
              className="input-field"
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
            >
              {Object.entries(HOUSING_COEFFICIENTS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="customMonthlyExpense" className="mb-1 block text-sm font-medium text-gray-700">
              毎月の生活費（万円）
              <span className="ml-1 font-normal text-gray-400">— 任意</span>
            </label>
            <input
              id="customMonthlyExpense"
              type="number"
              className="input-field"
              value={customMonthlyExpense ?? ""}
              onChange={(e) =>
                setCustomMonthlyExpense(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={1}
              step={1}
              placeholder="未入力なら地域×家族×住宅から自動推定"
              aria-describedby="customMonthlyExpense-hint"
            />
            <p id="customMonthlyExpense-hint" className="mt-1 text-xs text-gray-400">
              実際の生活費が分かっている場合に入力すると、より正確な結果になります
            </p>
          </div>
        </div>
      </fieldset>

      {/* FIREタイプ */}
      <fieldset className="card">
        <legend className="mb-4 text-lg font-bold text-gray-800">FIREタイプ</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.entries(FIRE_STRATEGIES) as [FireStrategy, typeof FIRE_STRATEGIES[FireStrategy]][]).map(
            ([key, strategy]) => (
              <label
                key={key}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                  fireStrategy === key
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="fireStrategy"
                  value={key}
                  checked={fireStrategy === key}
                  onChange={() => setFireStrategy(key)}
                  className="sr-only"
                />
                <p className="font-bold text-gray-800">{strategy.shortLabel}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {strategy.description}
                </p>
              </label>
            ),
          )}
        </div>
      </fieldset>

      {/* 詳細設定 */}
      <div className="card">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
          aria-controls="advanced-settings"
        >
          <h2 className="text-lg font-bold text-gray-800">詳細設定</h2>
          <span className="text-sm text-gray-500">
            {showAdvanced ? "閉じる ▲" : "開く ▼"}
          </span>
        </button>
        {showAdvanced && (
          <div id="advanced-settings" className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="annualReturnRate" className="mb-1 block text-sm font-medium text-gray-700">
                  想定運用利回り（%）
                </label>
                <NumberInput
                  id="annualReturnRate"
                  className="input-field"
                  value={annualReturnRate}
                  onValueChange={setAnnualReturnRate}
                  min={0}
                  max={20}
                  step={0.5}
                  aria-describedby="annualReturnRate-hint"
                />
                <p id="annualReturnRate-hint" className="mt-1 text-xs text-gray-400">
                  積立期間中の運用利回り
                </p>
              </div>
              {fireStrategy === "withdrawal" ? (
                <div>
                  <label htmlFor="swr" className="mb-1 block text-sm font-medium text-gray-700">
                    取り崩し率 SWR（%）
                  </label>
                  <NumberInput
                    id="swr"
                    className="input-field"
                    value={swr}
                    onValueChange={setSwr}
                    min={1}
                    max={10}
                    step={0.5}
                    aria-describedby="swr-hint"
                  />
                  <p id="swr-hint" className="mt-1 text-xs text-gray-400">
                    FIRE後に毎年取り崩す率
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="yieldRate" className="mb-1 block text-sm font-medium text-gray-700">
                    想定配当利回り（%）
                  </label>
                  <NumberInput
                    id="yieldRate"
                    className="input-field"
                    value={yieldRate}
                    onValueChange={setYieldRate}
                    min={0.5}
                    max={10}
                    step={0.5}
                    aria-describedby="yieldRate-hint"
                  />
                  <p id="yieldRate-hint" className="mt-1 text-xs text-gray-400">
                    FIRE後に得る配当/利息の年率（税引前）
                  </p>
                </div>
              )}
              <div>
                <label htmlFor="inflationRate" className="mb-1 block text-sm font-medium text-gray-700">
                  物価上昇率（%）
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
            </div>

            {/* 税金・社会保険 */}
            <fieldset className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <legend className="mb-3 text-sm font-medium text-gray-700">
                FIRE後の税金・社会保険
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="dividendTaxRate" className="mb-1 block text-sm text-gray-600">
                    運用益の税率（%）
                  </label>
                  <NumberInput
                    id="dividendTaxRate"
                    className="input-field"
                    value={dividendTaxRate}
                    onValueChange={setDividendTaxRate}
                    min={0}
                    max={55}
                    step={0.1}
                    aria-describedby="dividendTaxRate-hint"
                  />
                  <p id="dividendTaxRate-hint" className="mt-1 text-xs text-gray-400">
                    通常約20%。NISA活用で0%に近づく
                  </p>
                </div>
                <div>
                  <label htmlFor="postFireMonthlyCost" className="mb-1 block text-sm text-gray-600">
                    FIRE後の社会保険料（万円/月）
                  </label>
                  <input
                    id="postFireMonthlyCost"
                    type="number"
                    className="input-field"
                    value={
                      postFireMonthlyCost ??
                      estimatePostFireMonthlyCost(familyType)
                    }
                    onChange={(e) =>
                      setPostFireMonthlyCost(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    min={0}
                    step={0.1}
                    aria-describedby="postFireMonthlyCost-hint"
                  />
                  <p id="postFireMonthlyCost-hint" className="mt-1 text-xs text-gray-400">
                    国民健康保険＋国民年金の概算。家族構成から自動推定
                  </p>
                </div>
              </div>
            </fieldset>
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary w-full text-lg">
        シミュレーションを実行
      </button>
    </form>
  );
}
