import type { Habit, JournalEntry, Task } from "@/store/AppContext";
import { levelFromTotalXp } from "./game";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  check: (s: {
    tasks: Task[];
    habits: Habit[];
    journal: JournalEntry[];
    totalXp: number;
  }) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-task",
    name: "First Strike",
    description: "Complete your first task.",
    check: (s) => s.tasks.some((t) => t.done),
  },
  {
    id: "ten-tasks",
    name: "Builder",
    description: "Complete 10 tasks.",
    check: (s) => s.tasks.filter((t) => t.done).length >= 10,
  },
  {
    id: "fifty-tasks",
    name: "Workhorse",
    description: "Complete 50 tasks.",
    check: (s) => s.tasks.filter((t) => t.done).length >= 50,
  },
  {
    id: "first-habit",
    name: "Spark",
    description: "Log your first habit.",
    check: (s) => s.habits.some((h) => h.history.length > 0),
  },
  {
    id: "streak-7",
    name: "One Week Strong",
    description: "Reach a 7-day streak on any habit.",
    check: (s) => s.habits.some((h) => h.streak >= 7 || h.longestStreak >= 7),
  },
  {
    id: "streak-30",
    name: "Disciplined",
    description: "Reach a 30-day streak on any habit.",
    check: (s) => s.habits.some((h) => h.streak >= 30 || h.longestStreak >= 30),
  },
  {
    id: "first-journal",
    name: "Reflective",
    description: "Write your first journal entry.",
    check: (s) => s.journal.length >= 1,
  },
  {
    id: "ten-journal",
    name: "Inner Voice",
    description: "Write 10 journal entries.",
    check: (s) => s.journal.length >= 10,
  },
  {
    id: "level-5",
    name: "Adept Climber",
    description: "Reach level 5.",
    check: (s) => levelFromTotalXp(s.totalXp).level >= 5,
  },
  {
    id: "level-15",
    name: "Established",
    description: "Reach level 15.",
    check: (s) => levelFromTotalXp(s.totalXp).level >= 15,
  },
  {
    id: "level-30",
    name: "Force of Habit",
    description: "Reach level 30.",
    check: (s) => levelFromTotalXp(s.totalXp).level >= 30,
  },
];
