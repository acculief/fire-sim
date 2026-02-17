const API_URL = "/api/counter";

/** カウント取得 */
export async function getSimulationCount(): Promise<number> {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

/** シミュレーション実行時にカウント+1 */
export async function incrementSimulationCount(): Promise<void> {
  try {
    await fetch(API_URL, { method: "POST" });
  } catch {
    // ignore
  }
}
