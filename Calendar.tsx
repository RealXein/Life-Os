import { useApp } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function fmtKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarPage() {
  const { tasks, habits, journal } = useApp();
  const [cursor, setCursor] = useState(new Date());

  const grid = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    const startDay = start.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= end.getDate(); i++)
      days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, { tasks: number; habits: number; journal: number }> = {};
    const ensure = (k: string) => (map[k] ??= { tasks: 0, habits: 0, journal: 0 });
    for (const t of tasks) {
      if (t.dueDate) ensure(t.dueDate).tasks += 1;
      if (t.completedAt) ensure(t.completedAt.slice(0, 10)).tasks += 1;
    }
    for (const h of habits) {
      for (const d of h.history) ensure(d).habits += 1;
    }
    for (const e of journal) ensure(e.date).journal += 1;
    return map;
  }, [tasks, habits, journal]);

  const monthLabel = cursor.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground text-sm mt-1">
          A glance at activity and due dates across the month.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">{monthLabel}</CardTitle>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
              data-testid="button-prev-month"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setCursor(new Date())}
              data-testid="button-today-month"
            >
              .
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
              data-testid="button-next-month"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-1 py-1 uppercase tracking-wide text-[10px]">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d, i) => {
              if (!d) return <div key={i} className="h-20 rounded-md bg-transparent" />;
              const k = fmtKey(d);
              const ev = eventsByDay[k];
              const isToday = k === fmtKey(new Date());
              return (
                <div
                  key={i}
                  className={`h-20 rounded-md border p-1 flex flex-col gap-1 text-xs ${
                    isToday ? "border-primary" : "border-border"
                  }`}
                  data-testid={`day-${k}`}
                >
                  <div
                    className={`text-[10px] font-mono ${
                      isToday ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {d.getDate()}
                  </div>
                  {ev && (
                    <div className="flex flex-wrap gap-1">
                      {ev.tasks > 0 && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0">
                          T {ev.tasks}
                        </Badge>
                      )}
                      {ev.habits > 0 && (
                        <Badge variant="default" className="text-[9px] px-1 py-0">
                          H {ev.habits}
                        </Badge>
                      )}
                      {ev.journal > 0 && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                          J
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
