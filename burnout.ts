import type { JournalEntry } from "@/store/AppContext";
import { lastNDays, todayKey } from "./game";

export type BurnoutRisk = "low" | "medium" | "high";

export interface BurnoutInput {
  journal: JournalEntry[];
  taskCompletionsByDay: Record<string, number>;
  taskTargetPerDay?: number;
  brokenStreaks7d: number;
}

export function computeBurnout(input: BurnoutInput): BurnoutRisk {
  const days = lastNDays(7);
  const moods = input.journal
    .filter((e) => days.includes(e.date))
    .map((e) => e.mood);

  const totalCompletions = days.reduce(
    (sum, d) => sum + (input.taskCompletionsByDay[d] ?? 0),
    0,
  );

  // Insufficient signal: no journal entries and no task completions yet.
  if (moods.length === 0 && totalCompletions === 0) return "low";

  const moodAvg =
    moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 3.5;

  const target = input.taskTargetPerDay ?? 3;
  const completionRate =
    days.reduce((sum, d) => {
      const done = input.taskCompletionsByDay[d] ?? 0;
      return sum + Math.min(1, done / target);
    }, 0) / days.length;

  let score = 0;
  if (moodAvg < 2.5) score += 2;
  else if (moodAvg < 3.2) score += 1;
  if (moods.length >= 2) {
    if (completionRate < 0.3) score += 2;
    else if (completionRate < 0.55) score += 1;
  }
  if (input.brokenStreaks7d >= 5) score += 2;
  else if (input.brokenStreaks7d >= 3) score += 1;

  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

export function moodAverage(journal: JournalEntry[], days: number): number {
  const range = lastNDays(days);
  const moods = journal
    .filter((e) => range.includes(e.date))
    .map((e) => e.mood);
  if (moods.length === 0) return 0;
  return moods.reduce((a, b) => a + b, 0) / moods.length;
}

export function consistencyScore(
  taskCompletionsByDay: Record<string, number>,
  habitCompletionsByDay: Record<string, number>,
  days: number = 14,
): number {
  const range = lastNDays(days);
  let activeDays = 0;
  for (const d of range) {
    if ((taskCompletionsByDay[d] ?? 0) + (habitCompletionsByDay[d] ?? 0) > 0)
      activeDays += 1;
  }
  return Math.round((activeDays / days) * 100);
}

export function productivityScore(
  taskCompletionsByDay: Record<string, number>,
  habitCompletionsByDay: Record<string, number>,
  days: number = 14,
): number {
  const range = lastNDays(days);
  let total = 0;
  for (const d of range) {
    total += (taskCompletionsByDay[d] ?? 0) * 8 + (habitCompletionsByDay[d] ?? 0) * 5;
  }
  return Math.min(100, Math.round((total / (days * 30)) * 100));
}

export function todayString(): string {
  return todayKey();
}
