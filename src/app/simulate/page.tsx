"use client";

import { useState, useEffect, useCallback } from "react";
import SimulationForm from "@/components/SimulationForm";
import ResultDisplay from "@/components/ResultDisplay";
import SimulationHistory from "@/components/SimulationHistory";
import ComparePanel from "@/components/ComparePanel";
import { runSimulation, inputFromParams, inputToParams } from "@/lib/calculator";
import { saveHistory, getHistory } from "@/lib/history";
import { incrementSimulationCount } from "@/lib/counter";
import type { SimulationInput, SimulationResult } from "@/lib/types";
import type { HistoryItem } from "@/lib/history";

export default function SimulatePage() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [initialInput, setInitialInput] = useState<Partial<SimulationInput>>({});
  const [shareUrl, setShareUrl] = useState("");
  const [compareTarget, setCompareTarget] = useState<HistoryItem | null>(null);
  const [historyKey, setHistoryKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("pref")) {
      const paramsObj = Object.fromEntries(params);
      const input = inputFromParams(paramsObj);
      setInitialInput(input);
      const simResult = runSimulation(input);
      setResult(simResult);
      setShareUrl(window.location.origin + "/simulate/?" + inputToParams(input));
    }
  }, []);

  const handleSubmit = useCallback((input: SimulationInput) => {
    const simResult = runSimulation(input);
    setResult(simResult);
    incrementSimulationCount();

    const queryStr = inputToParams(input);
    const url = window.location.origin + "/simulate/?" + queryStr;
    setShareUrl(url);
    window.history.replaceState(null, "", "/simulate/?" + queryStr);

    // 履歴に保存
    saveHistory({
      input,
      summary: {
        prefectureName: simResult.prefectureName,
        strategyLabel: simResult.strategyLabel,
        fireNumber: simResult.scenarios.neutral.fireNumber,
        achievementAge: simResult.scenarios.neutral.achievementAge,
        monthlyExpense: simResult.scenarios.neutral.monthlyExpense,
      },
    });
    setHistoryKey((k) => k + 1);

    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleLoadHistory = useCallback((item: HistoryItem) => {
    setInitialInput(item.input);
    const simResult = runSimulation(item.input);
    setResult(simResult);

    const queryStr = inputToParams(item.input);
    const url = window.location.origin + "/simulate/?" + queryStr;
    setShareUrl(url);
    window.history.replaceState(null, "", "/simulate/?" + queryStr);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          FIREシミュレーション
        </h1>
        <p className="mt-2 text-gray-600">
          あなたの条件でFIRE達成に必要な資産と年数を計算します
        </p>
      </div>

      <SimulationForm initialInput={initialInput} onSubmit={handleSubmit} />

      {result && (
        <div id="result" className="mt-10 space-y-6">
          {/* 比較パネル */}
          {compareTarget && (
            <ComparePanel
              current={{
                prefectureName: result.prefectureName,
                strategyLabel: result.strategyLabel,
                fireNumber: result.scenarios.neutral.fireNumber,
                achievementAge: result.scenarios.neutral.achievementAge,
                monthlyExpense: result.scenarios.neutral.monthlyExpense,
              }}
              compare={compareTarget}
              onClose={() => setCompareTarget(null)}
            />
          )}

          <ResultDisplay result={result} shareUrl={shareUrl} />
        </div>
      )}

      {/* 履歴 */}
      <div className="mt-8" key={historyKey}>
        <SimulationHistory
          onLoad={handleLoadHistory}
          compareTarget={compareTarget}
          onCompare={setCompareTarget}
        />
      </div>
    </div>
  );
}
