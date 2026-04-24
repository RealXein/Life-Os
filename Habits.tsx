import { useApp, type Habit } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, Flame, Plus, Trash2, Snowflake } from "lucide-react";
import { REWARDS, todayKey, lastNDays, type HabitDifficulty } from "@/lib/game";
import { useMemo, useState } from "react";

export default function HabitsPage() {
  const { habits, setHabits, profile, setProfile, addXp, addCoins } = useApp();
  const [creating, setCreating] = useState(false);

  const today = todayKey();
  const last30 = useMemo(() => lastNDays(30), []);

  const toggle = (id: string) => {
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

  const remove = (id: string) => {
    setHabits((all) => all.filter((h) => h.id !== id));
  };

  const useFreeze = (id: string) => {
    if (profile.inventory.streakFreeze < 1) return;
    setProfile((p) => ({
      ...p,
      inventory: { ...p.inventory, streakFreeze: p.inventory.streakFreeze - 1 },
    }));
    setHabits((all) =>
      all.map((h) => (h.id === id ? { ...h, lastCompleted: today } : h)),
    );
  };

  const createHabit = (input: { name: string; difficulty: HabitDifficulty; schedule: Habit["schedule"] }) => {
    const h: Habit = {
      id: crypto.randomUUID(),
      name: input.name,
      difficulty: input.difficulty,
      schedule: input.schedule,
      customDays: [],
      streak: 0,
      longestStreak: 0,
      lastCompleted: null,
      history: [],
      createdAt: new Date().toISOString(),
    };
    setHabits((all) => [...all, h]);
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Habits</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build streaks. Streak rewards grow with consistency.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} data-testid="button-new-habit">
          <Plus className="size-4 mr-1" />
          New habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {habits.length === 0 && (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No habits yet. Create one to start a streak.
            </CardContent>
          </Card>
        )}
        {habits.map((h) => {
          const done = h.lastCompleted === today;
          return (
            <Card key={h.id} data-testid={`card-habit-${h.id}`}>
              <CardHeader className="flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{h.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {h.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {h.schedule}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="font-mono gap-1">
                    <Flame className="size-3" />
                    {h.streak}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => useFreeze(h.id)}
                    disabled={profile.inventory.streakFreeze < 1 || done}
                    aria-label="Use streak freeze"
                    data-testid={`button-freeze-${h.id}`}
                  >
                    <Snowflake className="size-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove(h.id)}
                    data-testid={`button-delete-habit-${h.id}`}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <button
                  type="button"
                  onClick={() => toggle(h.id)}
                  data-testid={`button-toggle-habit-${h.id}`}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover-elevate text-left"
                >
                  {done ? (
                    <CheckCircle2 className="size-5 text-primary" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {done ? "Completed today" : "Mark complete for today"}
                  </span>
                </button>
                <div className="mt-3 flex flex-wrap gap-1" aria-label="Last 30 days">
                  {last30.map((d) => {
                    const ok = h.history.includes(d);
                    return (
                      <span
                        key={d}
                        title={d}
                        className={`size-2.5 rounded-sm ${
                          ok ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Longest streak {h.longestStreak} · Total {h.history.length}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <NewHabitDialog open={creating} onOpenChange={setCreating} onCreate={createHabit} />
    </div>
  );
}

function NewHabitDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (h: { name: string; difficulty: HabitDifficulty; schedule: Habit["schedule"] }) => void;
}) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<HabitDifficulty>("easy");
  const [schedule, setSchedule] = useState<Habit["schedule"]>("daily");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) {
          setName("");
          setDifficulty("easy");
          setSchedule("daily");
        }
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New habit</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read 20 pages"
              data-testid="input-habit-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as HabitDifficulty)}>
                <SelectTrigger data-testid="select-habit-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Schedule</Label>
              <Select
                value={schedule}
                onValueChange={(v) => setSchedule(v as Habit["schedule"])}
              >
                <SelectTrigger data-testid="select-habit-schedule">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!name.trim()}
            onClick={() => onCreate({ name: name.trim(), difficulty, schedule })}
            data-testid="button-create-habit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
