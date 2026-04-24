import type { Habit, JournalEntry, Task, Goal } from "@/store/AppContext";
import { lastNDays, todayKey, levelFromTotalXp, rankFor } from "./game";
import { computeBurnout, consistencyScore, productivityScore } from "./burnout";

export interface AggregatedStats {
  todayKey: string;
  tasksCompletedToday: number;
  tasksTotalToday: number;
  habitsTrackedToday: number;
  habitsTotal: number;
  activeStreak: number;
  longestStreak: number;
  level: number;
  rank: string;
  coins: number;
  goalsInProgress: number;
  moodAverage7d: number;
  moodAverage30d: number;
  burnoutRisk: "low" | "medium" | "high";
  consistency: number;
  productivity: number;
  taskCompletionsByDay: Record<string, number>;
  habitCompletionsByDay: Record<string, number>;
}

export function aggregateStats(args: {
  tasks: Task[];
  habits: Habit[];
  journal: JournalEntry[];
  goals: Goal[];
  totalXp: number;
  coins: number;
  taskTargetPerDay: number;
}): AggregatedStats {
  const today = todayKey();

  const tasksCompletedToday = args.tasks.filter(
    (t) => t.done && t.completedAt && t.completedAt.startsWith(today),
  ).length;
  const tasksTotalToday = args.tasks.filter(
    (t) => !t.done || (t.completedAt && t.completedAt.startsWith(today)),
  ).length;

  const habitsTrackedToday = args.habits.filter(
    (h) => h.lastCompleted === today,
  ).length;

  const taskCompletionsByDay: Record<string, number> = {};
  for (const t of args.tasks) {
    if (t.completedAt) {
      const d = t.completedAt.slice(0, 10);
      taskCompletionsByDay[d] = (taskCompletionsByDay[d] ?? 0) + 1;
    }
  }
  const habitCompletionsByDay: Record<string, number> = {};
  for (const h of args.habits) {
    for (const d of h.history) {
      habitCompletionsByDay[d] = (habitCompletionsByDay[d] ?? 0) + 1;
    }
  }

  const last7 = lastNDays(7);
  let brokenStreaks7d = 0;
  for (const h of args.habits) {
    for (const day of last7) {
      if (h.schedule === "weekdays") {
        const dow = new Date(day + "T00:00:00").getDay();
        if (dow === 0 || dow === 6) continue;
      }
      if (!h.history.includes(day)) brokenStreaks7d += 1;
    }
  }

  const moodsRange7 = lastNDays(7);
  const moods7 = args.journal
    .filter((e) => moodsRange7.includes(e.date))
    .map((e) => e.mood);
  const moodAverage7d =
    moods7.length === 0 ? 0 : moods7.reduce((a, b) => a + b, 0) / moods7.length;
  const moodsRange30 = lastNDays(30);
  const moods30 = args.journal
    .filter((e) => moodsRange30.includes(e.date))
    .map((e) => e.mood);
  const moodAverage30d =
    moods30.length === 0
      ? 0
      : moods30.reduce((a, b) => a + b, 0) / moods30.length;

  const burnoutRisk = computeBurnout({
    journal: args.journal,
    taskCompletionsByDay,
    taskTargetPerDay: args.taskTargetPerDay,
    brokenStreaks7d,
  });

  const consistency = consistencyScore(taskCompletionsByDay, habitCompletionsByDay);
  const productivity = productivityScore(
    taskCompletionsByDay,
    habitCompletionsByDay,
  );

  const { level } = levelFromTotalXp(args.totalXp);
  const tier = rankFor(level);
  const activeStreak = Math.max(0, ...args.habits.map((h) => h.streak));
  const longestStreak = Math.max(0, ...args.habits.map((h) => h.longestStreak));
  const goalsInProgress = args.goals.filter(
    (g) => g.milestones.some((m) => !m.done),
  ).length;

  return {
    todayKey: today,
    tasksCompletedToday,
    tasksTotalToday,
    habitsTrackedToday,
    habitsTotal: args.habits.length,
    activeStreak,
    longestStreak,
    level,
    rank: tier.name,
    coins: args.coins,
    goalsInProgress,
    moodAverage7d,
    moodAverage30d,
    burnoutRisk,
    consistency,
    productivity,
    taskCompletionsByDay,
    habitCompletionsByDay,
  };
}
