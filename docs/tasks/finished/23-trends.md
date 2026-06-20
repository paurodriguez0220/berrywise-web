# Task: Trends

**Status:** Queue

## Goal

Give users a visual overview of how spending has changed over time — a line or bar chart of total expenses per week or month.

## Context

The app currently shows balances and a flat expense list, but there's no way to see spending patterns at a glance. A Trends tab fills this gap and adds value without requiring any new DB tables — it derives everything from the existing `expenses` table.

## Implementation Plan

### Step 1 — Choose a chart library

Recommended: **Recharts** (`npm install recharts`) — lightweight, fully declarative React API, good mobile touch support, no Canvas gymnastics.

```bash
npm install recharts
```

### Step 2 — Data computation (`src/features/trends/use-trends.ts`)

Derive monthly buckets client-side from the expenses already loaded by `useExpenses`:

```ts
export interface TrendPoint {
  label: string;  // e.g. "Jan", "Feb"
  total: number;  // sum of expense amounts in that month
}

export function useTrends(): { points: TrendPoint[]; isLoading: boolean }
```

- Group expenses by `createdAt` year+month
- Sort ascending
- Show the last 6 months (or all months if fewer)
- No extra DB call needed — reuse the `useExpenses` hook

### Step 3 — TrendsPage component (`src/features/trends/TrendsPage.tsx`)

- Heading "Spending Trends"
- `BarChart` (or `LineChart`) from Recharts with:
  - X axis: month label
  - Y axis: formatted PHP amount
  - Bar/line fill using the app's red (`#e63946`)
  - Responsive container that fills the page width
- Empty state: "No expenses yet" when there's no data
- Loading state while expenses are being fetched

### Step 4 — Wire into navigation

`src/components/BottomNav.tsx` — add a "Trends" tab (5th tab or replace an existing one).

`src/App.tsx` (or router) — add `TrendsPage` to the tab routing.

### Step 5 — Stories and tests

- `TrendsPage.stories.ts`: `WithData`, `Empty`, `SingleMonth`
- Unit test: `use-trends.test.ts` — verify bucketing logic, correct totals, last-6-month window

## Acceptance Criteria

- [ ] Trends tab visible in the bottom nav
- [ ] Chart shows monthly spend totals for up to the last 6 months
- [ ] Amounts display in PHP format on the Y axis
- [ ] Empty state shown when there are no expenses
- [ ] Chart is responsive and readable on a 390px iPhone screen
- [ ] Stories cover at least 3 visual states
- [ ] Bucketing logic covered by unit tests

## Notes

- No DB schema changes required
- If adding a 5th tab makes the nav too crowded on small screens, replace "Settle" with a button inside the Balances tab instead

---
*Added: 2026-06-20*
