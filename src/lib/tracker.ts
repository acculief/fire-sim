export interface TrackerEntry {
  date: string; // YYYY-MM
  assets: number; // 万円
}

export interface TrackerGoal {
  fireNumber: number; // 万円
  targetAge: number;
}

const STORAGE_KEY = "fire-tracker-entries";
const GOAL_KEY = "fire-tracker-goal";

export function getEntries(): TrackerEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: TrackerEntry): TrackerEntry[] {
  const entries = getEntries();
  const idx = entries.findIndex((e) => e.date === entry.date);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  entries.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
}

export function deleteEntry(date: string): TrackerEntry[] {
  const entries = getEntries().filter((e) => e.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
}

export function getGoal(): TrackerGoal | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGoal(goal: TrackerGoal): void {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
}
