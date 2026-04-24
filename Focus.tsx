import { useApp, type FocusSession } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pause, Play, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { REWARDS, todayKey, lastNDays } from "@/lib/game";
import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "focus" | "break" | "idle";

export default function FocusPage() {
  const { settings, tasks, focusSessions, setFocusSessions, addXp, addCoins } = useApp();
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoroFocus * 60);
  const [running, setRunning] = useState(false);
  const [linkedTaskId, setLinkedTaskId] = useState<string>("none");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase === "idle") setSecondsLeft(settings.pomodoroFocus * 60);
  }, [settings.pomodoroFocus, phase]);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1));
      }, 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (running && secondsLeft === 0) {
      setRunning(false);
      if (phase === "focus") {
        const session: FocusSession = {
          id: crypto.randomUUID(),
          date: todayKey(),
          taskId: linkedTaskId === "none" ? null : linkedTaskId,
          durationMin: settings.pomodoroFocus,
        };
        setFocusSessions((all) => [session, ...all]);
        addXp(REWARDS.focusSessionXp);
        addCoins(REWARDS.focusSessionCoins);
        setPhase("break");
        setSecondsLeft(settings.pomodoroBreak * 60);
      } else if (phase === "break") {
        setPhase("idle");
        setSecondsLeft(settings.pomodoroFocus * 60);
      }
    }
  }, [
    secondsLeft,
    running,
    phase,
    linkedTaskId,
    settings.pomodoroFocus,
    settings.pomodoroBreak,
    addXp,
    addCoins,
    setFocusSessions,
  ]);

  const start = () => {
    if (phase === "idle") {
      setPhase("focus");
      setSecondsLeft(settings.pomodoroFocus * 60);
    }
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setPhase("idle");
    setSecondsLeft(settings.pomodoroFocus * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const total =
    phase === "break" ? settings.pomodoroBreak * 60 : settings.pomodoroFocus * 60;
  const pct = ((total - secondsLeft) / total) * 100;

  const todayMin = useMemo(() => {
    const today = todayKey();
    return focusSessions
      .filter((s) => s.date === today)
      .reduce((acc, s) => acc + s.durationMin, 0);
  }, [focusSessions]);

  const last7 = useMemo(() => {
    const days = lastNDays(7);
    return days.map((d) => ({
      day: d.slice(5),
      min: focusSessions
        .filter((s) => s.date === d)
        .reduce((acc, s) => acc + s.durationMin, 0),
    }));
  }, [focusSessions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Focus</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pomodoro: {settings.pomodoroFocus}m focus, {settings.pomodoroBreak}m break.
          Earn {REWARDS.focusSessionXp} XP per completed session.
        </p>
      </div>

      <Card data-testid="card-focus-timer">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          <Badge variant={phase === "focus" ? "default" : "outline"} className="uppercase tracking-widest">
            {phase === "focus" ? "Focus" : phase === "break" ? "Break" : "Ready"}
          </Badge>
          <div
            className="text-7xl md:text-8xl font-mono tabular-nums"
            data-testid="text-timer"
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <Progress value={pct} className="w-full max-w-md" />
          <div className="flex items-center gap-2">
            {!running ? (
              <Button onClick={start} size="lg" data-testid="button-start">
                <Play className="size-4 mr-1" /> Start
              </Button>
            ) : (
              <Button onClick={pause} size="lg" variant="outline" data-testid="button-pause">
                <Pause className="size-4 mr-1" /> Pause
              </Button>
            )}
            <Button onClick={reset} size="lg" variant="ghost" data-testid="button-reset">
              <RotateCcw className="size-4 mr-1" /> Reset
            </Button>
          </div>
          <div className="w-full max-w-md">
            <Select value={linkedTaskId} onValueChange={setLinkedTaskId}>
              <SelectTrigger data-testid="select-focus-task">
                <SelectValue placeholder="Link a task (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No linked task</SelectItem>
                {tasks
                  .filter((t) => !t.done)
                  .map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TimerIcon className="size-4" /> Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{todayMin}m</div>
            <div className="text-xs text-muted-foreground mt-1">
              {focusSessions.filter((s) => s.date === todayKey()).length} sessions
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-24">
              {last7.map((d) => {
                const max = Math.max(60, ...last7.map((x) => x.min));
                const h = Math.max(2, (d.min / max) * 96);
                return (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-primary/70 rounded-sm"
                      style={{ height: `${h}px` }}
                    />
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {d.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
