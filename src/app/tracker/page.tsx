"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import RelatedContent from "@/components/RelatedContent";
import {
  getEntries,
  saveEntry,
  deleteEntry,
  getGoal,
  saveGoal,
  type TrackerEntry,
  type TrackerGoal,
} from "@/lib/tracker";

export default function TrackerPage() {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [goal, setGoal] = useState<TrackerGoal | null>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalFireNumber, setGoalFireNumber] = useState(7500);
  const [goalTargetAge, setGoalTargetAge] = useState(50);

  // 入力フォーム
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [inputDate, setInputDate] = useState(currentMonth);
  const [inputAssets, setInputAssets] = useState("");

  useEffect(() => {
    setEntries(getEntries());
    const g = getGoal();
    if (g) {
      setGoal(g);
      setGoalFireNumber(g.fireNumber);
      setGoalTargetAge(g.targetAge);
    }
  }, []);

  const handleAddEntry = useCallback(() => {
    if (!inputAssets || Number(inputAssets) < 0) return;
    const updated = saveEntry({ date: inputDate, assets: Number(inputAssets) });
    setEntries(updated);
    setInputAssets("");
  }, [inputDate, inputAssets]);

  const handleDeleteEntry = useCallback((date: string) => {
    const updated = deleteEntry(date);
    setEntries(updated);
  }, []);

  const handleSaveGoal = useCallback(() => {
    const g: TrackerGoal = { fireNumber: goalFireNumber, targetAge: goalTargetAge };
    saveGoal(g);
    setGoal(g);
    setShowGoalForm(false);
  }, [goalFireNumber, goalTargetAge]);

  // 進捗率
  const latestAssets = entries.length > 0 ? entries[entries.length - 1].assets : 0;
  const progressPercent = goal ? Math.min(100, Math.round((latestAssets / goal.fireNumber) * 100)) : 0;

  // 前月比
  const prevAssets = entries.length >= 2 ? entries[entries.length - 2].assets : null;
  const monthlyChange = prevAssets !== null ? latestAssets - prevAssets : null;

  // 簡易グラフ用データ（棒グラフをCSSで描画）
  const maxAssets = Math.max(
    goal?.fireNumber ?? 0,
    ...entries.map((e) => e.assets),
    1,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        FIRE進捗トラッカー
      </h1>
      <p className="mt-2 text-gray-600">
        毎月の資産額を記録して、FIRE達成までの進捗を可視化しましょう。
        データはブラウザに保存されます。
      </p>

      {/* 目標設定 */}
      <div className="card mt-6">
        {goal && !showGoalForm ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">FIRE目標資産</p>
              <p className="text-2xl font-bold text-primary-700">
                {goal.fireNumber.toLocaleString()}万円
              </p>
              <p className="text-sm text-gray-500">
                目標年齢: {goal.targetAge}歳
              </p>
            </div>
            <button
              className="btn-secondary text-sm"
              onClick={() => setShowGoalForm(true)}
            >
              変更
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {goal ? "目標を変更" : "FIRE目標を設定"}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="goalFireNumber" className="mb-1 block text-sm font-medium text-gray-700">
                  目標資産額（万円）
                </label>
                <input
                  id="goalFireNumber"
                  type="number"
                  className="input-field"
                  value={goalFireNumber}
                  onChange={(e) => setGoalFireNumber(Number(e.target.value))}
                  min={100}
                  step={100}
                />
              </div>
              <div>
                <label htmlFor="goalTargetAge" className="mb-1 block text-sm font-medium text-gray-700">
                  目標達成年齢
                </label>
                <input
                  id="goalTargetAge"
                  type="number"
                  className="input-field"
                  value={goalTargetAge}
                  onChange={(e) => setGoalTargetAge(Number(e.target.value))}
                  min={20}
                  max={100}
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-primary text-sm" onClick={handleSaveGoal}>
                保存
              </button>
              {goal && (
                <button
                  className="btn-secondary text-sm"
                  onClick={() => setShowGoalForm(false)}
                >
                  キャンセル
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              目標資産がわからない場合は
              <Link href="/simulate/" className="text-primary-600 hover:underline">
                シミュレーション
              </Link>
              で計算できます
            </p>
          </div>
        )}
      </div>

      {/* 進捗バー */}
      {goal && entries.length > 0 && (
        <div className="card mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">現在の進捗</p>
              <p className="text-3xl font-bold text-primary-700">
                {progressPercent}%
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-gray-500">現在の資産</p>
              <p className="text-xl font-bold text-gray-800">
                {latestAssets.toLocaleString()}万円
              </p>
              {monthlyChange !== null && (
                <p
                  className={`text-sm font-medium ${monthlyChange >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {monthlyChange >= 0 ? "+" : ""}
                  {monthlyChange.toLocaleString()}万円/月
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>{goal.fireNumber.toLocaleString()}万円</span>
          </div>
        </div>
      )}

      {/* 資産記録フォーム */}
      <div className="card mt-6">
        <h2 className="text-lg font-bold text-gray-800">資産を記録する</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:flex">
          <div className="col-span-1 sm:w-40">
            <label htmlFor="entryDate" className="sr-only">年月</label>
            <input
              id="entryDate"
              type="month"
              className="input-field text-sm"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
          </div>
          <div className="col-span-1 sm:flex-1">
            <label htmlFor="entryAssets" className="sr-only">金融資産（万円）</label>
            <input
              id="entryAssets"
              type="number"
              className="input-field text-sm"
              value={inputAssets}
              onChange={(e) => setInputAssets(e.target.value)}
              placeholder="金融資産（万円）"
              min={0}
              step={10}
            />
          </div>
          <button className="btn-primary col-span-2 text-sm sm:shrink-0" onClick={handleAddEntry}>
            記録
          </button>
        </div>
      </div>

      {/* 推移グラフ（CSSバーチャート） */}
      {entries.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-lg font-bold text-gray-800">資産推移</h2>
          <div className="mt-4 space-y-2">
            {goal && (
              <div className="mb-3 flex items-center gap-2 text-xs text-gray-400">
                <div className="h-px flex-1 border-t-2 border-dashed border-gray-300" />
                <span>目標: {goal.fireNumber.toLocaleString()}万円</span>
              </div>
            )}
            {entries.map((entry) => {
              const pct = Math.round((entry.assets / maxAssets) * 100);
              const isLatest = entry === entries[entries.length - 1];
              return (
                <div key={entry.date} className="group">
                  <div className="flex items-center gap-2">
                    <span className="w-[4.5rem] shrink-0 text-xs text-gray-500">
                      {entry.date}
                    </span>
                    <div className="relative min-w-0 flex-1">
                      <div
                        className={`h-6 rounded transition-all ${isLatest ? "bg-primary-500" : "bg-primary-300"}`}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                      {goal && (
                        <div
                          className="absolute top-0 h-6 w-px bg-gray-400"
                          style={{
                            left: `${Math.round((goal.fireNumber / maxAssets) * 100)}%`,
                          }}
                        />
                      )}
                    </div>
                    <span className="shrink-0 text-right text-xs font-medium text-gray-700">
                      {entry.assets.toLocaleString()}万
                    </span>
                    <button
                      className="shrink-0 text-xs text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                      onClick={() => handleDeleteEntry(entry.date)}
                      aria-label={`${entry.date}のデータを削除`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 空の状態 */}
      {entries.length === 0 && (
        <div className="mt-8 rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-lg font-bold text-gray-600">
            まだ記録がありません
          </p>
          <p className="mt-2 text-sm text-gray-500">
            上のフォームから今月の金融資産を記録して、FIRE達成への進捗を追跡しましょう。
          </p>
        </div>
      )}

      <RelatedContent
        items={[
          { href: "/simulate/", title: "FIREシミュレーション", description: "地域・年収・家族構成から必要資産を計算" },
          { href: "/guide/fire-index-investing/", title: "インデックス投資入門", description: "資産を増やすための投資戦略" },
          { href: "/cases/", title: "年代別モデルケース", description: "同世代のFIREプランを参考に" },
          { href: "/recommend/", title: "おすすめ証券口座", description: "FIRE達成に役立つツール" },
        ]}
      />

      {/* CTA */}
      <div className="mt-8 rounded-lg border border-primary-200 bg-primary-50 p-6 text-center">
        <p className="font-bold text-primary-800">
          目標資産がわからない？
        </p>
        <p className="mt-1 text-sm text-primary-700">
          シミュレーションで、あなたに必要なFIRE資産を計算しましょう
        </p>
        <Link
          href="/simulate/"
          className="btn-primary mt-3 inline-block"
        >
          シミュレーションで計算
        </Link>
      </div>
    </div>
  );
}
