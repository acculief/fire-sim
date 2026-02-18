"use client";

import { useState, useEffect } from "react";
import { getHistory, deleteHistoryItem, clearHistory } from "@/lib/history";
import { formatMoney } from "@/lib/format";
import { inputToParams } from "@/lib/calculator";
import type { HistoryItem } from "@/lib/history";

interface Props {
  onLoad: (item: HistoryItem) => void;
  compareTarget?: HistoryItem | null;
  onCompare: (item: HistoryItem | null) => void;
}

export default function SimulationHistory({
  onLoad,
  compareTarget,
  onCompare,
}: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const refresh = () => setHistory(getHistory());

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    if (compareTarget?.id === id) onCompare(null);
    refresh();
  };

  const handleClear = () => {
    clearHistory();
    onCompare(null);
    refresh();
  };

  if (history.length === 0) return null;

  return (
    <div className="card">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold text-gray-800">
          シミュレーション履歴
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({history.length}件)
          </span>
        </h2>
        <span className="text-sm text-gray-500">
          {isOpen ? "閉じる ▲" : "開く ▼"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-2">
          {history.map((item) => {
            const isComparing = compareTarget?.id === item.id;
            const date = new Date(item.timestamp);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  isComparing
                    ? "border-primary-400 bg-primary-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {item.summary.prefectureName}・{item.summary.strategyLabel}
                    <span className="ml-2 text-xs text-gray-400">
                      {dateStr}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    必要資産 {formatMoney(item.summary.fireNumber)} /
                    達成{" "}
                    {item.summary.achievementAge !== null
                      ? `${item.summary.achievementAge}歳`
                      : "ー"}
                  </p>
                </div>
                <div className="ml-3 flex shrink-0 gap-1.5">
                  <button
                    aria-label={`${item.summary.prefectureName}・${item.summary.strategyLabel}を読み込む`}
                    className="rounded bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200"
                    onClick={() => onLoad(item)}
                  >
                    読込
                  </button>
                  <button
                    aria-label={`${item.summary.prefectureName}・${item.summary.strategyLabel}と比較`}
                    className={`rounded px-2.5 py-1 text-xs font-medium ${
                      isComparing
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                    onClick={() => onCompare(isComparing ? null : item)}
                  >
                    比較
                  </button>
                  <button
                    aria-label={`${item.summary.prefectureName}・${item.summary.strategyLabel}を削除`}
                    className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-red-100 hover:text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-red-500"
            onClick={handleClear}
          >
            履歴をすべて削除
          </button>
        </div>
      )}
    </div>
  );
}
