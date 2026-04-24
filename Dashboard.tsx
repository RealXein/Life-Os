import { useApp } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  ArrowRight,
  Coins,
  Flame,
  Target as TargetIcon,
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
  Brain,
} from "lucide-react";
import { aggregateStats } from "@/lib/stats";
import { levelFromTotalXp, rankFor, REWARDS, todayKey } from "@/lib/game";
import { reflectionForDate } from "@/lib/islamic";
import { useMemo } from "react";

export default function Dashboard() {
  const { tasks, habits, journal, goals, profile, settings, setTasks, setHabits, addXp, addCoins } =
    useApp();

  const stats = useMemo(
    () =>
      aggregateStats({
        tasks,
        habits,
        journal,
        goals,
        totalXp: profile.totalXp,
        coins: profile.coins,
        taskTargetPerDay: settings.taskTargetPerDay,
      }),
    [tasks, habits, journal, goals, profile.totalXp, profile.coins, settings.taskTargetPerDay],
  );

  const { level, xpInLevel, xpForNext } = levelFromTotalXp(profile.totalXp);
  const tier = rankFor(level);

  const today = todayKey();
  const dailyTasks = tasks
    .filter((t) => !t.done || (t.completedAt && t.completedAt.startsWith(today)))
    .sort((a, b) => Number(a.done) - Number(b.done) || a.order - b.order)
    .slice(0, 5);

  const dailyHabits = habits.slice(0, 5);
  const dailyChallenge = useMemo(() => {
    const list = [
      "Complete 3 tasks before noon.",
      "Log all habits today.",
      "Write a journal entry.",
      "Hit one focus session.",
      "Cross off one urgent task.",
    ];
    let h = 0;
    for (let i = 0; i < today.length; i++) h = (h * 31 + today.charCodeAt(i)) >>> 0;
    return list[h % list.length];
  }, [today]);

  const reflection = settings.islamicContent ? reflectionForDate(today) : null;

  const toggleTask = (id: string) => {
    let earned: { xp: number; coins: number } | null = null;
    setTasks((all) =>
      all.map((t) => {
        if (t.id !== id) return t;
        const newDone = !t.done;
        if (newDone) {
          const xp = REWARDS.taskBaseXp(t.priority);
          const coins = REWARDS.taskBaseCoins(t.priority);
          earned = { xp, coins };
          return { ...t, done: true, completedAt: new Date().toISOString() };
        }
        return { ...t, done: false, completedAt: null };
      }),
    );
    if (earned) {
      addXp(earned.xp);
      addCoins(earned.coins);
    }
  };

  const toggleHabit = (id: string) => {
    setHabits((all) =>
      all.map((h) => {
        if (h.id !== id) return h;
        if (h.lastCompleted === today) {
          const newHistory = h.history.filter((d) => d !== today);
          return {
            ...h,
            history: newHistory,
            lastCompleted: newHistory[newHistory.length - 1] ?? null,
            streak: Math.max(0, h.streak - 1),
          };
        }
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = todayKey(yesterday);
        const newStreak = h.lastCompleted === yKey ? h.streak + 1 : 1;
        const xp = REWARDS.habitXp(newStreak, h.difficulty);
        const coins = REWARDS.habitCoins(h.difficulty);
        addXp(xp);
        addCoins(coins);
        return {
          ...h,
          history: [...h.history, today],
          lastCompleted: today,
          streak: newStreak,
          longestStreak: Math.max(h.longestStreak, newStreak),
        };
      }),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" data-testid="text-greeting">
            Welcome back, {profile.name}.
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {tier.name} · Level {level} · {tier.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/tasks">
            <Button variant="default" data-testid="button-go-tasks">
              Open Tasks <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
          <Link href="/coach">
            <Button variant="outline" data-testid="button-go-coach">
              <Brain className="size-4 mr-1" /> Ask Coach
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          icon={<TrendingUp className="size-4" />}
          label="Level"
          value={`Lv ${level}`}
          sub={`${xpInLevel}/${xpForNext} XP`}
          progress={(xpInLevel / xpForNext) * 100}
          testId="stat-level"
        />
        <StatTile
          icon={<Coins className="size-4" />}
          label="Coins"
          value={profile.coins.toString()}
          sub="spend in shop"
          testId="stat-coins"
        />
        <StatTile
          icon={<Flame className="size-4" />}
          label="Best streak"
          value={stats.activeStreak.toString()}
          sub={`max ${stats.longestStreak}`}
          testId="stat-streak"
        />
        <StatTile
          icon={<TargetIcon className="size-4" />}
          label="Goals"
          value={stats.goalsInProgress.toString()}
          sub="in progress"
          testId="stat-goals"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" data-testid="card-today-tasks">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Today's Tasks</CardTitle>
            <Badge variant="secondary" className="font-mono">
              {stats.tasksCompletedToday}/{stats.tasksTotalToday}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-1">
            {dailyTasks.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nothing queued. Add one in Tasks.
              </p>
            )}
            {dailyTasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTask(t.id)}
                data-testid={`button-toggle-task-${t.id}`}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover-elevate text-left"
              >
                {t.done ? (
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                ) : (
                  <Circle className="size-4 text-muted-foreground shrink-0" />
                )}
                <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : ""}`}>
                  {t.title}
                </span>
                <PriorityBadge priority={t.priority} />
              </button>
            ))}
          </CardContent>
        </Card>

        <Card data-testid="card-today-habits">
          <CardHeader>
            <CardTitle className="text-base">Habits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {dailyHabits.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No habits yet.
              </p>
            )}
            {dailyHabits.map((h) => {
              const done = h.lastCompleted === today;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggleHabit(h.id)}
                  data-testid={`button-toggle-habit-${h.id}`}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover-elevate text-left"
                >
                  {done ? (
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={`flex-1 text-sm ${done ? "line-through text-muted-foreground" : ""}`}>
                    {h.name}
                  </span>
                  <Badge variant="outline" className="font-mono gap-1 text-xs">
                    <Flame className="size-3" />
                    {h.streak}
                  </Badge>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card data-testid="card-daily-challenge">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Daily Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {dailyChallenge}
            <div className="text-xs mt-3 font-mono text-foreground">
              +{REWARDS.dailyChallengeBonusXp} XP · +
              {REWARDS.dailyChallengeBonusCoins} coins on completion
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-burnout">
          <CardHeader>
            <CardTitle className="text-base">Wellbeing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Burnout risk</span>
              <Badge
                variant={stats.burnoutRisk === "high" ? "destructive" : "outline"}
                data-testid="badge-burnout"
              >
                {stats.burnoutRisk}
              </Badge>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Consistency 14d</span>
                <span className="font-mono">{stats.consistency}%</span>
              </div>
              <Progress value={stats.consistency} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Productivity 14d</span>
                <span className="font-mono">{stats.productivity}%</span>
              </div>
              <Progress value={stats.productivity} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {reflection ? (
          <Card data-testid="card-islamic">
            <CardHeader>
              <CardTitle className="text-base">Reflection</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="leading-relaxed">"{reflection.text}"</p>
              <p className="mt-3 text-xs text-muted-foreground">
                — {reflection.reference}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/journal">
                <Button variant="outline" className="w-full justify-start">
                  Add a journal entry
                </Button>
              </Link>
              <Link href="/focus">
                <Button variant="outline" className="w-full justify-start">
                  Start a focus session
                </Button>
              </Link>
              <Link href="/goals">
                <Button variant="outline" className="w-full justify-start">
                  Review goals
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
  progress,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  progress?: number;
  testId: string;
}) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <div className="text-2xl font-semibold mt-2">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{sub}</div>
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-2" />
        )}
      </CardContent>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const variant =
    priority === "urgent"
      ? "destructive"
      : priority === "high"
      ? "default"
      : "outline";
  return (
    <Badge variant={variant as "default" | "outline" | "destructive"} className="text-[10px] uppercase">
      {priority}
    </Badge>
  );
}
