import { useApp } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Send, Sparkles, Trash2 } from "lucide-react";
import { useLocalState } from "@/lib/storage";
import { aggregateStats } from "@/lib/stats";
import { useMemo, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
}

const MODES: { id: "strict" | "chill" | "islamic"; label: string; description: string }[] = [
  { id: "strict", label: "Strict", description: "Direct, accountability-first." },
  { id: "chill", label: "Chill", description: "Calm, encouraging tone." },
  { id: "islamic", label: "Islamic", description: "Soft Islamic motivation." },
];

export default function CoachPage() {
  const { tasks, habits, journal, goals, profile, settings, setSettings, setTasks } = useApp();
  const [messages, setMessages] = useLocalState<ChatMessage[]>("lifeos.v1.coachHistory", []);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

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

  const buildContext = () => ({
    tasksCompletedToday: stats.tasksCompletedToday,
    tasksTotalToday: stats.tasksTotalToday,
    activeStreak: stats.activeStreak,
    longestStreak: stats.longestStreak,
    moodAverage7d: stats.moodAverage7d,
    burnoutRisk: stats.burnoutRisk,
    level: stats.level,
    rank: stats.rank,
    coins: profile.coins,
    goalsInProgress: stats.goalsInProgress,
    habitsTrackedToday: stats.habitsTrackedToday,
  });

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    const user: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      ts: Date.now(),
    };
    setMessages((all) => [...all, user]);
    setInput("");
    setPending(true);
    try {
      const history = [...messages, user]
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`${import.meta.env.BASE_URL}api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: settings.aiMode,
          context: buildContext(),
          messages: history,
        }),
      });
      const data = await res.json();
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply || "I don't have a response right now. Try again in a moment.",
        ts: Date.now(),
      };
      setMessages((all) => [...all, reply]);
    } catch {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I couldn't reach the coach right now. Check your connection and try again.",
        ts: Date.now(),
      };
      setMessages((all) => [...all, reply]);
    } finally {
      setPending(false);
    }
  };

  const planMyDay = async () => {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/ai/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: settings.aiMode,
          date: new Date().toISOString().slice(0, 10),
          tasks: tasks
            .filter((t) => !t.done)
            .slice(0, 12)
            .map((t) => ({
              title: t.title,
              priority: t.priority,
              estimateMin: t.estimateMin ?? undefined,
            })),
          habits: habits.map((h) => ({
            name: h.name,
            doneToday: h.lastCompleted === new Date().toISOString().slice(0, 10),
          })),
          goals: goals.map((g) => ({
            name: g.title,
            progress:
              g.milestones.length > 0
                ? Math.round(
                    (g.milestones.filter((m) => m.done).length /
                      g.milestones.length) *
                      100,
                  )
                : 0,
          })),
        }),
      });
      const data = await res.json();
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.plan || data.reply || "I couldn't draft a plan right now.",
        ts: Date.now(),
      };
      setMessages((all) => [...all, reply]);
      if (Array.isArray(data.suggestedTasks) && data.suggestedTasks.length > 0) {
        setTasks((all) => [
          ...all,
          ...data.suggestedTasks.map((s: { title: string; priority?: string }, i: number) => ({
            id: crypto.randomUUID(),
            title: s.title,
            done: false,
            priority: (s.priority as "low" | "med" | "high" | "urgent") || "med",
            tag: "coach",
            dueDate: null,
            estimateMin: null,
            notes: "",
            subtasks: [],
            createdAt: new Date().toISOString(),
            completedAt: null,
            order: all.length + i,
          })),
        ]);
      }
    } catch {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I couldn't draft a plan. Try again soon.",
        ts: Date.now(),
      };
      setMessages((all) => [...all, reply]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Brain className="size-6" /> Coach
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            An AI helper that knows your stats. Choose a mode that matches your energy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={settings.aiMode}
            onValueChange={(v) =>
              setSettings((s) => ({ ...s, aiMode: v as typeof settings.aiMode }))
            }
          >
            <SelectTrigger className="w-40" data-testid="select-coach-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.label} — {m.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setMessages([])}
            data-testid="button-clear-chat"
          >
            <Trash2 className="size-4 mr-1" /> Clear
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Conversation</CardTitle>
          <Button onClick={planMyDay} disabled={pending} data-testid="button-plan-day">
            <Sparkles className="size-4 mr-1" /> Plan my day
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-12">
              No messages yet. Ask anything or tap "Plan my day".
            </div>
          )}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${m.role}-${m.id}`}
              >
                <div
                  className={`max-w-[85%] rounded-md px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 items-end pt-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              placeholder="Ask the coach... (Ctrl+Enter to send)"
              data-testid="input-coach-message"
            />
            <Button onClick={send} disabled={pending || !input.trim()} data-testid="button-send-coach">
              <Send className="size-4" />
            </Button>
          </div>
          <Badge variant="outline" className="text-[10px] capitalize">
            Mode: {settings.aiMode}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
