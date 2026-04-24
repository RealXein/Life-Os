import { useApp, type Goal } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { REWARDS } from "@/lib/game";
import { useState } from "react";

export default function GoalsPage() {
  const { goals, setGoals, addXp, addCoins } = useApp();
  const [creating, setCreating] = useState(false);

  const addMilestone = (goalId: string, title: string) => {
    if (!title.trim()) return;
    setGoals((all) =>
      all.map((g) =>
        g.id === goalId
          ? {
              ...g,
              milestones: [
                ...g.milestones,
                { id: crypto.randomUUID(), title: title.trim(), done: false, doneAt: null },
              ],
            }
          : g,
      ),
    );
  };

  const toggleMilestone = (goalId: string, mid: string) => {
    let earned = false;
    setGoals((all) =>
      all.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map((m) => {
            if (m.id !== mid) return m;
            const newDone = !m.done;
            if (newDone) earned = true;
            return { ...m, done: newDone, doneAt: newDone ? new Date().toISOString() : null };
          }),
        };
      }),
    );
    if (earned) {
      addXp(REWARDS.milestoneXp);
      addCoins(REWARDS.milestoneCoins);
    }
  };

  const removeGoal = (id: string) => {
    setGoals((all) => all.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Long-arc targets broken into milestones.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} data-testid="button-new-goal">
          <Plus className="size-4 mr-1" />
          New goal
        </Button>
      </div>

      <div className="space-y-4">
        {goals.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No goals yet.
            </CardContent>
          </Card>
        )}
        {goals.map((g) => (
          <GoalCard
            key={g.id}
            goal={g}
            onAddMilestone={(t) => addMilestone(g.id, t)}
            onToggleMilestone={(mid) => toggleMilestone(g.id, mid)}
            onRemove={() => removeGoal(g.id)}
          />
        ))}
      </div>

      <NewGoalDialog
        open={creating}
        onOpenChange={setCreating}
        onCreate={(g) => {
          const goal: Goal = {
            id: crypto.randomUUID(),
            title: g.title,
            targetDate: g.targetDate || null,
            milestones: g.firstMilestone
              ? [
                  {
                    id: crypto.randomUUID(),
                    title: g.firstMilestone,
                    done: false,
                    doneAt: null,
                  },
                ]
              : [],
            createdAt: new Date().toISOString(),
            notes: g.notes,
          };
          setGoals((all) => [...all, goal]);
          setCreating(false);
        }}
      />
    </div>
  );
}

function GoalCard({
  goal,
  onAddMilestone,
  onToggleMilestone,
  onRemove,
}: {
  goal: Goal;
  onAddMilestone: (t: string) => void;
  onToggleMilestone: (mid: string) => void;
  onRemove: () => void;
}) {
  const [text, setText] = useState("");
  const completed = goal.milestones.filter((m) => m.done).length;
  const total = goal.milestones.length || 1;
  const pct = (completed / total) * 100;

  return (
    <Card data-testid={`card-goal-${goal.id}`}>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="flex-1">
          <CardTitle className="text-lg">{goal.title}</CardTitle>
          {goal.targetDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Target {goal.targetDate}
            </p>
          )}
          {goal.notes && (
            <p className="text-xs text-muted-foreground mt-1">{goal.notes}</p>
          )}
        </div>
        <Button size="icon" variant="ghost" onClick={onRemove} data-testid={`button-delete-goal-${goal.id}`}>
          <Trash2 className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono">
              {completed}/{goal.milestones.length}
            </span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>

        <div className="space-y-1">
          {goal.milestones.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onToggleMilestone(m.id)}
              data-testid={`button-toggle-milestone-${m.id}`}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover-elevate text-left text-sm"
            >
              {m.done ? (
                <CheckCircle2 className="size-4 text-primary" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span className={m.done ? "line-through text-muted-foreground" : ""}>
                {m.title}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add milestone"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAddMilestone(text);
                setText("");
              }
            }}
            data-testid={`input-milestone-${goal.id}`}
          />
          <Button
            variant="outline"
            onClick={() => {
              onAddMilestone(text);
              setText("");
            }}
            disabled={!text.trim()}
            data-testid={`button-add-milestone-${goal.id}`}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NewGoalDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (g: { title: string; targetDate: string; firstMilestone: string; notes: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [firstMilestone, setFirstMilestone] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) {
          setTitle("");
          setTargetDate("");
          setFirstMilestone("");
          setNotes("");
        }
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-goal-title"
            />
          </div>
          <div>
            <Label>Target date (optional)</Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              data-testid="input-goal-target"
            />
          </div>
          <div>
            <Label>First milestone (optional)</Label>
            <Input
              value={firstMilestone}
              onChange={(e) => setFirstMilestone(e.target.value)}
              data-testid="input-goal-milestone"
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="input-goal-notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!title.trim()}
            onClick={() =>
              onCreate({ title: title.trim(), targetDate, firstMilestone, notes })
            }
            data-testid="button-create-goal"
          >
            Create goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
