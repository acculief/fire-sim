import type { SimulationInput } from "./types";

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: SimulationInput;
  summary: {
    prefectureName: string;
    strategyLabel: string;
    fireNumber: number;
    achievementAge: number | null;
    monthlyExpense: number;
  };
}

const STORAGE_KEY = "fire-sim-history";
const MAX_ITEMS = 10;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(item: Omit<HistoryItem, "id" | "timestamp">): void {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: generateId(),
    timestamp: Date.now(),
  };
  const updated = [newItem, ...history].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const updated = history.filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
