import { useApp, type JournalEntry } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { REWARDS, todayKey } from "@/lib/game";
import { useState } from "react";

const MOOD_LABELS = ["Awful", "Low", "Neutral", "Good", "Great"];

export default function JournalPage() {
  const { journal, setJournal, addXp, addCoins } = useApp();
  const [text, setText] = useState("");
  const [mood, setMood] = useState(3);
  const [tags, setTags] = useState("");

  const save = () => {
    if (!text.trim()) return;
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: todayKey(),
      mood,
      text: text.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    setJournal((all) => [entry, ...all]);
    addXp(REWARDS.journalXp);
    addCoins(REWARDS.journalCoins);
    setText("");
    setTags("");
    setMood(3);
  };

  const remove = (id: string) => {
    setJournal((all) => all.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Journal</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track mood and capture reflections. Each entry rewards XP.
        </p>
      </div>

      <Card data-testid="card-journal-compose">
        <CardHeader>
          <CardTitle className="text-base">New entry · {todayKey()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="mb-2 block">Mood</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {MOOD_LABELS.map((label, i) => {
                const value = i + 1;
                const active = mood === value;
                return (
                  <Button
                    key={label}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMood(value)}
                    data-testid={`button-mood-${value}`}
                  >
                    {value} · {label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div>
            <Label>Reflection</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="What stood out today?"
              data-testid="input-journal-text"
            />
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. work, family, stress"
              data-testid="input-journal-tags"
            />
          </div>
          <Button onClick={save} disabled={!text.trim()} data-testid="button-save-journal">
            Save entry · +{REWARDS.journalXp} XP
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground">
          Past entries · {journal.length}
        </h2>
        {journal.length === 0 && (
          <p className="text-sm text-muted-foreground py-6">No entries yet.</p>
        )}
        {journal.map((e) => (
          <Card key={e.id} data-testid={`row-journal-${e.id}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{e.date}</span>
                  <Badge variant="outline">{MOOD_LABELS[e.mood - 1]}</Badge>
                  {e.tags.map((tag) => (
                    <span key={tag} className="text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(e.id)}
                  data-testid={`button-delete-journal-${e.id}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{e.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
