/** 万円を表示用にフォーマット */
export function formatMoney(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}億円`;
  }
  return `${Math.round(value).toLocaleString()}万円`;
}

/** パーセンテージ表示 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/** 年数差の表示 */
export function formatYearDiff(diff: number | null): string {
  if (diff === null) return "ー";
  if (diff === 0) return "変化なし";
  if (diff < 0) return `${Math.abs(diff)}年短縮`;
  return `${diff}年延長`;
}
