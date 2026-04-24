export type ThemeRarity = "free" | "common" | "rare" | "epic" | "legendary";

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  mode: "dark" | "light";
  rarity: ThemeRarity;
  price: number;
  preview: { background: string; surface: string; primary: string; accent: string };
  vars: Record<string, string>;
}

const obsidian: ThemeDefinition = {
  id: "obsidian-focus",
  name: "Obsidian Focus",
  description: "Deep neutral dark with warm amber accent. The default.",
  mode: "dark",
  rarity: "free",
  price: 0,
  preview: { background: "#0a0a0c", surface: "#0f1014", primary: "#ffb020", accent: "#1c1d23" },
  vars: {
    "--background": "240 10% 4%",
    "--foreground": "0 0% 92%",
    "--border": "240 5% 15%",
    "--card": "240 10% 6%",
    "--card-foreground": "0 0% 92%",
    "--card-border": "240 5% 15%",
    "--sidebar": "240 10% 4%",
    "--sidebar-foreground": "0 0% 88%",
    "--sidebar-border": "240 5% 14%",
    "--sidebar-primary": "35 100% 55%",
    "--sidebar-primary-foreground": "240 10% 4%",
    "--sidebar-accent": "240 5% 12%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-ring": "35 100% 55%",
    "--popover": "240 10% 7%",
    "--popover-foreground": "0 0% 92%",
    "--popover-border": "240 5% 18%",
    "--primary": "35 100% 55%",
    "--primary-foreground": "240 10% 4%",
    "--secondary": "240 5% 14%",
    "--secondary-foreground": "0 0% 92%",
    "--muted": "240 5% 12%",
    "--muted-foreground": "240 5% 60%",
    "--accent": "240 5% 14%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 65% 55%",
    "--destructive-foreground": "0 0% 100%",
    "--input": "240 5% 18%",
    "--ring": "35 100% 55%",
    "--chart-1": "35 100% 55%",
    "--chart-2": "210 60% 55%",
    "--chart-3": "150 45% 50%",
    "--chart-4": "340 60% 55%",
    "--chart-5": "270 45% 60%",
  },
};

const midnightBlue: ThemeDefinition = {
  id: "midnight-blue",
  name: "Midnight Blue",
  description: "Deep indigo dark with cool electric accent.",
  mode: "dark",
  rarity: "free",
  price: 0,
  preview: { background: "#070b16", surface: "#0c1322", primary: "#5b8dff", accent: "#172447" },
  vars: {
    "--background": "225 35% 6%",
    "--foreground": "215 30% 92%",
    "--border": "225 25% 18%",
    "--card": "225 35% 9%",
    "--card-foreground": "215 30% 92%",
    "--card-border": "225 25% 18%",
    "--sidebar": "225 35% 6%",
    "--sidebar-foreground": "215 30% 88%",
    "--sidebar-border": "225 25% 16%",
    "--sidebar-primary": "220 90% 65%",
    "--sidebar-primary-foreground": "225 35% 6%",
    "--sidebar-accent": "225 30% 14%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-ring": "220 90% 65%",
    "--popover": "225 35% 10%",
    "--popover-foreground": "215 30% 92%",
    "--popover-border": "225 25% 22%",
    "--primary": "220 90% 65%",
    "--primary-foreground": "225 35% 6%",
    "--secondary": "225 30% 16%",
    "--secondary-foreground": "215 30% 92%",
    "--muted": "225 25% 14%",
    "--muted-foreground": "215 20% 65%",
    "--accent": "225 30% 16%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 65% 58%",
    "--destructive-foreground": "0 0% 100%",
    "--input": "225 25% 20%",
    "--ring": "220 90% 65%",
    "--chart-1": "220 90% 65%",
    "--chart-2": "190 80% 55%",
    "--chart-3": "260 70% 65%",
    "--chart-4": "340 65% 60%",
    "--chart-5": "150 50% 55%",
  },
};

const forestCalm: ThemeDefinition = {
  id: "forest-calm",
  name: "Forest Calm",
  description: "Deep green dark for restorative focus.",
  mode: "dark",
  rarity: "free",
  price: 0,
  preview: { background: "#08120e", surface: "#0e1b16", primary: "#5fcf95", accent: "#162a23" },
  vars: {
    "--background": "155 25% 5%",
    "--foreground": "150 15% 92%",
    "--border": "155 20% 16%",
    "--card": "155 25% 8%",
    "--card-foreground": "150 15% 92%",
    "--card-border": "155 20% 16%",
    "--sidebar": "155 25% 5%",
    "--sidebar-foreground": "150 15% 88%",
    "--sidebar-border": "155 20% 14%",
    "--sidebar-primary": "150 55% 60%",
    "--sidebar-primary-foreground": "155 30% 8%",
    "--sidebar-accent": "155 20% 14%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-ring": "150 55% 60%",
    "--popover": "155 25% 9%",
    "--popover-foreground": "150 15% 92%",
    "--popover-border": "155 20% 20%",
    "--primary": "150 55% 60%",
    "--primary-foreground": "155 30% 8%",
    "--secondary": "155 20% 14%",
    "--secondary-foreground": "150 15% 92%",
    "--muted": "155 20% 12%",
    "--muted-foreground": "150 10% 65%",
    "--accent": "155 20% 14%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "10 65% 55%",
    "--destructive-foreground": "0 0% 100%",
    "--input": "155 20% 18%",
    "--ring": "150 55% 60%",
    "--chart-1": "150 55% 60%",
    "--chart-2": "180 50% 50%",
    "--chart-3": "90 45% 55%",
    "--chart-4": "30 70% 60%",
    "--chart-5": "260 50% 65%",
  },
};

const sandstoneMinimal: ThemeDefinition = {
  id: "sandstone-minimal",
  name: "Sandstone Minimal",
  description: "Warm minimal light, easy on the eyes.",
  mode: "light",
  rarity: "free",
  price: 0,
  preview: { background: "#f7f4ee", surface: "#fdfbf6", primary: "#b56a1a", accent: "#ebe4d6" },
  vars: {
    "--background": "40 30% 96%",
    "--foreground": "25 20% 16%",
    "--border": "40 15% 82%",
    "--card": "40 30% 99%",
    "--card-foreground": "25 20% 16%",
    "--card-border": "40 15% 86%",
    "--sidebar": "40 25% 94%",
    "--sidebar-foreground": "25 20% 18%",
    "--sidebar-border": "40 15% 82%",
    "--sidebar-primary": "25 80% 42%",
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": "40 18% 88%",
    "--sidebar-accent-foreground": "25 20% 16%",
    "--sidebar-ring": "25 80% 42%",
    "--popover": "40 30% 99%",
    "--popover-foreground": "25 20% 16%",
    "--popover-border": "40 15% 86%",
    "--primary": "25 80% 42%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "40 18% 88%",
    "--secondary-foreground": "25 20% 16%",
    "--muted": "40 18% 90%",
    "--muted-foreground": "25 12% 40%",
    "--accent": "40 18% 88%",
    "--accent-foreground": "25 20% 16%",
    "--destructive": "0 70% 48%",
    "--destructive-foreground": "0 0% 100%",
    "--input": "40 15% 82%",
    "--ring": "25 80% 42%",
    "--chart-1": "25 80% 42%",
    "--chart-2": "200 50% 40%",
    "--chart-3": "140 35% 38%",
    "--chart-4": "320 45% 48%",
    "--chart-5": "280 35% 50%",
  },
};

const aurora: ThemeDefinition = {
  id: "aurora",
  name: "Aurora",
  description: "Cosmic gradient feel — teal & violet glow.",
  mode: "dark",
  rarity: "legendary",
  price: 800,
  preview: { background: "#070514", surface: "#0e0a25", primary: "#a47bff", accent: "#1a1235" },
  vars: {
    "--background": "260 50% 5%",
    "--foreground": "270 30% 95%",
    "--border": "260 40% 18%",
    "--card": "260 50% 8%",
    "--card-foreground": "270 30% 95%",
    "--card-border": "260 40% 22%",
    "--sidebar": "260 50% 5%",
    "--sidebar-foreground": "270 30% 92%",
    "--sidebar-border": "260 40% 16%",
    "--sidebar-primary": "265 90% 72%",
    "--sidebar-primary-foreground": "260 50% 5%",
    "--sidebar-accent": "260 40% 14%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-ring": "265 90% 72%",
    "--popover": "260 50% 9%",
    "--popover-foreground": "270 30% 95%",
    "--popover-border": "260 40% 22%",
    "--primary": "265 90% 72%",
    "--primary-foreground": "260 50% 5%",
    "--secondary": "260 40% 16%",
    "--secondary-foreground": "270 30% 95%",
    "--muted": "260 35% 14%",
    "--muted-foreground": "270 20% 70%",
    "--accent": "175 70% 55%",
    "--accent-foreground": "260 50% 5%",
    "--destructive": "340 75% 60%",
    "--destructive-foreground": "0 0% 100%",
    "--input": "260 40% 22%",
    "--ring": "265 90% 72%",
    "--chart-1": "265 90% 72%",
    "--chart-2": "175 70% 55%",
    "--chart-3": "320 75% 65%",
    "--chart-4": "200 80% 60%",
    "--chart-5": "45 90% 60%",
  },
};

const carbonRose: ThemeDefinition = {
  id: "carbon-rose",
  name: "Carbon Rose",
  description: "Carbon black with a quiet rose pulse.",
  mode: "dark",
  rarity: "epic",
  price: 500,
  preview: { background: "#0a0a0a", surface: "#121212", primary: "#ff6e8a", accent: "#1a1a1a" },
  vars: {
    "--background": "0 0% 4%",
    "--foreground": "0 0% 92%",
    "--border": "0 0% 16%",
    "--card": "0 0% 7%",
    "--card-foreground": "0 0% 92%",
    "--card-border": "0 0% 16%",
    "--sidebar": "0 0% 4%",
    "--sidebar-foreground": "0 0% 88%",
    "--sidebar-border": "0 0% 14%",
    "--sidebar-primary": "345 85% 65%",
    "--sidebar-primary-foreground": "0 0% 4%",
    "--sidebar-accent": "0 0% 12%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-ring": "345 85% 65%",
    "--popover": "0 0% 8%",
    "--popover-foreground": "0 0% 92%",
    "--popover-border": "0 0% 18%",
    "--primary": "345 85% 65%",
    "--primary-foreground": "0 0% 4%",
    "--secondary": "0 0% 14%",
    "--secondary-foreground": "0 0% 92%",
    "--muted": "0 0% 12%",
    "--muted-foreground": "0 0% 62%",
    "--accent": "0 0% 14%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 65% 55%",
    "--destructive-foreground": "0 0% 100%",
    "--input": "0 0% 18%",
    "--ring": "345 85% 65%",
    "--chart-1": "345 85% 65%",
    "--chart-2": "190 60% 50%",
    "--chart-3": "45 85% 60%",
    "--chart-4": "270 60% 65%",
    "--chart-5": "150 50% 55%",
  },
};

const solarizedPro: ThemeDefinition = {
  id: "solarized-pro",
  name: "Solarized Pro",
  description: "Developer-grade contrast tuned for long sessions.",
  mode: "dark",
  rarity: "rare",
  price: 280,
  preview: { background: "#0a1419", surface: "#0e1b22", primary: "#cb8b00", accent: "#152732" },
  vars: {
    "--background": "195 50% 7%",
    "--foreground": "45 25% 88%",
    "--border": "195 30% 18%",
    "--card": "195 45% 10%",
    "--card-foreground": "45 25% 88%",
    "--card-border": "195 30% 18%",
    "--sidebar": "195 50% 7%",
    "--sidebar-foreground": "45 25% 85%",
    "--sidebar-border": "195 30% 16%",
    "--sidebar-primary": "40 95% 50%",
    "--sidebar-primary-foreground": "195 50% 7%",
    "--sidebar-accent": "195 30% 14%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-ring": "40 95% 50%",
    "--popover": "195 45% 11%",
    "--popover-foreground": "45 25% 88%",
    "--popover-border": "195 30% 22%",
    "--primary": "40 95% 50%",
    "--primary-foreground": "195 50% 7%",
    "--secondary": "195 30% 16%",
    "--secondary-foreground": "45 25% 88%",
    "--muted": "195 30% 14%",
    "--muted-foreground": "45 15% 60%",
    "--accent": "195 30% 16%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 70% 55%",
    "--destructive-foreground": "0 0% 100%",
    "--input": "195 30% 20%",
    "--ring": "40 95% 50%",
    "--chart-1": "40 95% 50%",
    "--chart-2": "175 70% 45%",
    "--chart-3": "265 60% 65%",
    "--chart-4": "340 65% 55%",
    "--chart-5": "150 55% 50%",
  },
};

const slateMono: ThemeDefinition = {
  id: "slate-mono",
  name: "Slate Mono",
  description: "Pure slate with a soft sky highlight.",
  mode: "dark",
  rarity: "rare",
  price: 240,
  preview: { background: "#0e1116", surface: "#161b22", primary: "#7eb6ff", accent: "#1c222b" },
  vars: {
    "--background": "215 25% 8%",
    "--foreground": "215 15% 92%",
    "--border": "215 20% 18%",
    "--card": "215 25% 11%",
    "--card-foreground": "215 15% 92%",
    "--card-border": "215 20% 18%",
    "--sidebar": "215 25% 8%",
    "--sidebar-foreground": "215 15% 88%",
    "--sidebar-border": "215 20% 16%",
    "--sidebar-primary": "210 90% 70%",
    "--sidebar-primary-foreground": "215 25% 8%",
    "--sidebar-accent": "215 20% 16%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-ring": "210 90% 70%",
    "--popover": "215 25% 12%",
    "--popover-foreground": "215 15% 92%",
    "--popover-border": "215 20% 22%",
    "--primary": "210 90% 70%",
    "--primary-foreground": "215 25% 8%",
    "--secondary": "215 20% 16%",
    "--secondary-foreground": "215 15% 92%",
    "--muted": "215 20% 14%",
    "--muted-foreground": "215 12% 65%",
    "--accent": "215 20% 16%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 65% 58%",
    "--destructive-foreground": "0 0% 100%",
    "--input": "215 20% 22%",
    "--ring": "210 90% 70%",
    "--chart-1": "210 90% 70%",
    "--chart-2": "165 60% 55%",
    "--chart-3": "30 75% 60%",
    "--chart-4": "320 60% 65%",
    "--chart-5": "260 55% 65%",
  },
};

export const THEMES: ThemeDefinition[] = [
  obsidian,
  midnightBlue,
  forestCalm,
  sandstoneMinimal,
  solarizedPro,
  slateMono,
  carbonRose,
  aurora,
];

export const THEME_BY_ID: Record<string, ThemeDefinition> = Object.fromEntries(
  THEMES.map((t) => [t.id, t]),
);

export const ACCENT_SWATCHES: { id: string; label: string; hsl: string }[] = [
  { id: "amber", label: "Amber", hsl: "35 100% 55%" },
  { id: "indigo", label: "Indigo", hsl: "230 85% 65%" },
  { id: "emerald", label: "Emerald", hsl: "150 60% 55%" },
  { id: "rose", label: "Rose", hsl: "345 85% 65%" },
  { id: "violet", label: "Violet", hsl: "265 80% 70%" },
  { id: "cyan", label: "Cyan", hsl: "185 80% 55%" },
];

const STORAGE_THEME = "lifeos.v1.theme";
const STORAGE_ACCENT = "lifeos.v1.accent";

export function getStoredThemeId(): string {
  try {
    return window.localStorage.getItem(STORAGE_THEME) || "obsidian-focus";
  } catch {
    return "obsidian-focus";
  }
}

export function getStoredAccent(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_ACCENT);
  } catch {
    return null;
  }
}

export function applyTheme(themeId: string, accentHsl?: string | null): void {
  const theme = THEME_BY_ID[themeId] || obsidian;
  const root = document.documentElement;
  for (const [k, v] of Object.entries(theme.vars)) {
    root.style.setProperty(k, v);
  }
  if (theme.mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  if (accentHsl) {
    root.style.setProperty("--primary", accentHsl);
    root.style.setProperty("--ring", accentHsl);
    root.style.setProperty("--sidebar-primary", accentHsl);
    root.style.setProperty("--sidebar-ring", accentHsl);
  }
}

export function setTheme(themeId: string): void {
  try {
    window.localStorage.setItem(STORAGE_THEME, themeId);
  } catch {
    /* no-op */
  }
  applyTheme(themeId, getStoredAccent());
  window.dispatchEvent(new CustomEvent("lifeos:theme-changed"));
}

export function setAccent(hsl: string | null): void {
  try {
    if (hsl === null) window.localStorage.removeItem(STORAGE_ACCENT);
    else window.localStorage.setItem(STORAGE_ACCENT, hsl);
  } catch {
    /* no-op */
  }
  applyTheme(getStoredThemeId(), hsl);
  window.dispatchEvent(new CustomEvent("lifeos:theme-changed"));
}

export function applyInitialTheme(): void {
  applyTheme(getStoredThemeId(), getStoredAccent());
}
