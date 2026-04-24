export type TaskPriority = "low" | "med" | "high" | "urgent";
export type HabitDifficulty = "easy" | "medium" | "hard";

export const TASK_XP: Record<TaskPriority, number> = {
  low: 10,
  med: 20,
  high: 35,
  urgent: 60,
};

export const HABIT_DIFFICULTY_MULT: Record<HabitDifficulty, number> = {
  easy: 1,
  medium: 1.4,
  hard: 1.9,
};

export const REWARDS = {
  taskBaseXp: (p: TaskPriority) => TASK_XP[p],
  taskBaseCoins: (p: TaskPriority) => Math.floor(TASK_XP[p] / 2),
  habitXp: (streak: number, difficulty: HabitDifficulty) =>
    Math.round(
      Math.min(50, 15 + streak * 5) * HABIT_DIFFICULTY_MULT[difficulty],
    ),
  habitCoins: (difficulty: HabitDifficulty) =>
    Math.round(5 * HABIT_DIFFICULTY_MULT[difficulty]),
  journalXp: 25,
  journalCoins: 10,
  milestoneXp: 80,
  milestoneCoins: 40,
  focusSessionXp: 40,
  focusSessionCoins: 20,
  dailyChallengeBonusXp: 30,
  dailyChallengeBonusCoins: 15,
};

export function nextLevelXp(level: number): number {
  return 100 + level * level * 15;
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) total += nextLevelXp(i);
  return total;
}

export function levelFromTotalXp(totalXp: number): {
  level: number;
  xpInLevel: number;
  xpForNext: number;
} {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= nextLevelXp(level)) {
    remaining -= nextLevelXp(level);
    level += 1;
  }
  return { level, xpInLevel: remaining, xpForNext: nextLevelXp(level) };
}

export interface RankTier {
  name: string;
  subtitle: string;
  minLevel: number;
}

export const RANK_TIERS: RankTier[] = [
  { name: "Rookie", subtitle: "Just getting started.", minLevel: 1 },
  { name: "Apprentice", subtitle: "Building real momentum.", minLevel: 6 },
  { name: "Adept", subtitle: "Consistent and sharpening.", minLevel: 16 },
  { name: "Expert", subtitle: "Refining the craft.", minLevel: 31 },
  { name: "Master", subtitle: "Operating at a high level.", minLevel: 51 },
  { name: "Legend", subtitle: "Quietly remarkable.", minLevel: 76 },
];

export function rankFor(level: number): RankTier {
  let current = RANK_TIERS[0];
  for (const t of RANK_TIERS) {
    if (level >= t.minLevel) current = t;
  }
  return current;
}

export function nextRank(level: number): RankTier | null {
  for (const t of RANK_TIERS) {
    if (t.minLevel > level) return t;
  }
  return null;
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function lastNDays(n: number, end: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    out.push(todayKey(d));
  }
  return out;
}
