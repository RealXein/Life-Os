# Workspace

## Overview

pnpm workspace monorepo containing the **LifeOS** product — a gamified, premium dark productivity app
served from `/` (artifact `lifeos`), backed by a small Express API (`api-server`) that fronts Anthropic
for the in-app AI Coach. There is also a `mockup-sandbox` artifact used for component previews.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **AI provider**: Anthropic (via `@workspace/integrations-anthropic-ai`, model `claude-sonnet-4-6`)
- **Frontend (LifeOS)**: React 19 + Vite 7, Tailwind v4, shadcn UI, Wouter, framer-motion, recharts, lucide-react
- **State / persistence**: localStorage with cross-tab sync (`useLocalState` hook in `src/lib/storage.ts`)
- **Validation**: Zod (`zod/v4`)
- **Build**: esbuild (api-server), Vite (frontends)

## LifeOS architecture

- Path-based artifact mounted at `/`. Backend is reachable from the client at
  `${import.meta.env.BASE_URL}api/...`.
- All persistent state lives in `localStorage` under the prefix `lifeos.v1.*`. No DB writes from the
  client. The app is fully offline-capable except for the AI Coach.
- Theming: `src/lib/themes.ts` defines 8 themes (4 free, 4 premium). Themes write CSS HSL variables
  on `<html>` and toggle `.dark`. `applyInitialTheme()` runs in `main.tsx` before paint to avoid FOUC.
- Game economy: `src/lib/game.ts` defines XP curve `nextLevelXp(L) = 100 + L^2 * 15`, ranks
  Rookie → Legend, and reward tables for tasks/habits/journal/milestones/focus.
- Global state: `src/store/AppContext.tsx` exposes tasks, habits, journal, goals, focus sessions,
  profile (xp/coins/inventory), and settings, plus `addXp / addCoins / spendCoins / resetAll`.
- Stats: `src/lib/stats.ts` aggregates burnout (via `src/lib/burnout.ts`), consistency,
  productivity, and per-day completion maps used by Dashboard, Stats, and the Coach context.
- AI Coach (`src/pages/Coach.tsx`) calls `POST /api/ai/chat` and `POST /api/ai/plan` with a
  structured `context` payload. Three modes: `strict`, `chill`, `islamic`. Server falls back to
  static replies if Anthropic errors. Conversation history persists in
  `localStorage` under `lifeos.v1.coachHistory`.

## Key directories

- `artifacts/lifeos/src/pages/` — Dashboard, Tasks, Habits, Journal, Goals, Focus, Calendar, Stats,
  Shop, Themes, Profile, Coach, Settings, Auth.
- `artifacts/lifeos/src/lib/` — `themes.ts`, `game.ts`, `burnout.ts`, `stats.ts`,
  `achievements.ts`, `shop.ts`, `islamic.ts`, `storage.ts`.
- `artifacts/lifeos/src/components/layout/AppLayout.tsx` — Sidebar + topbar shell with mobile bottom nav.
- `artifacts/api-server/src/routes/ai.ts` — `/api/ai/chat` and `/api/ai/plan`.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Environment

- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` and `AI_INTEGRATIONS_ANTHROPIC_API_KEY` must be set for the
  Coach to call Anthropic. Without them the server returns the static fallback replies.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
