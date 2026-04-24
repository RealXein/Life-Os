import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CheckSquare,
  Repeat,
  BookOpen,
  Target,
  ShoppingBag,
  Palette,
  Timer,
  CalendarDays,
  BarChart3,
  User,
  MessageSquare,
  Settings as SettingsIcon,
  Coins,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { levelFromTotalXp, rankFor } from "@/lib/game";
import { setTheme, getStoredThemeId, THEME_BY_ID } from "@/lib/themes";
import { useEffect, useState } from "react";

const NAV: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Habits", href: "/habits", icon: Repeat },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Focus", href: "/focus", icon: Timer },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Stats", href: "/stats", icon: BarChart3 },
  { label: "Coach", href: "/coach", icon: MessageSquare },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Themes", href: "/themes", icon: Palette },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { profile, doubleXpActive } = useApp();
  const { level, xpInLevel, xpForNext } = levelFromTotalXp(profile.totalXp);
  const tier = rankFor(level);
  const [themeId, setThemeId] = useState(getStoredThemeId());

  useEffect(() => {
    const handler = () => setThemeId(getStoredThemeId());
    window.addEventListener("lifeos:theme-changed", handler);
    return () => window.removeEventListener("lifeos:theme-changed", handler);
  }, []);

  const isDark = THEME_BY_ID[themeId]?.mode !== "light";

  const toggleMode = () => {
    setTheme(isDark ? "sandstone-minimal" : "obsidian-focus");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside
        className="hidden md:flex w-64 shrink-0 border-r border-sidebar-border bg-sidebar flex-col"
        data-testid="sidebar"
      >
        <div className="p-5 border-b border-sidebar-border">
          <Link href="/" data-testid="link-brand">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="size-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">LifeOS</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Operating system for you
                </div>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto" data-testid="nav-primary">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? location === "/"
                : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} data-testid={`nav-${item.label.toLowerCase()}`}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer mb-0.5 transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  }`}
                >
                  <Icon className="size-4 opacity-80" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-3">
          <div className="px-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{tier.name}</span>
              <span className="text-xs font-mono">Lv {level}</span>
            </div>
            <Progress value={(xpInLevel / xpForNext) * 100} className="h-1.5" />
            <div className="text-[10px] text-muted-foreground mt-1 font-mono">
              {xpInLevel} / {xpForNext} XP
            </div>
          </div>
          <div className="flex items-center justify-between px-2">
            <Badge variant="outline" className="gap-1 font-mono" data-testid="badge-coins">
              <Coins className="size-3" />
              {profile.coins}
            </Badge>
            {doubleXpActive && (
              <Badge variant="default" className="gap-1" data-testid="badge-doublexp">
                <Sparkles className="size-3" /> 2x
              </Badge>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border h-14 flex items-center justify-between px-4 md:px-6 sticky top-0 bg-background/80 backdrop-blur z-10">
          <div className="md:hidden flex items-center gap-2">
            <div className="size-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">L</span>
            </div>
            <span className="text-sm font-semibold">LifeOS</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm text-muted-foreground">
              {NAV.find((n) =>
                n.href === "/" ? location === "/" : location.startsWith(n.href),
              )?.label || "LifeOS"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMode}
              data-testid="button-toggle-mode"
              aria-label="Toggle light/dark mode"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-profile">
                <User className="size-4" />
                <span className="hidden sm:inline">{profile.name}</span>
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>

        <nav
          className="md:hidden border-t border-border bg-sidebar grid grid-cols-5 sticky bottom-0"
          data-testid="nav-mobile"
        >
          {NAV.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? location === "/" : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex flex-col items-center gap-1 py-2 text-[10px] ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
