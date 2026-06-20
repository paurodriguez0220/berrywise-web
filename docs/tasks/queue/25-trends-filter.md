# Task: Trends Filter by Month and Year

**Status:** Queue

## Goal

Let users filter the Trends page to a specific month/year so they can drill into spending patterns for any period, not just the last 6 months.

## UX Design

A compact filter bar at the top of the Trends page:

```
[ < ]  June 2026  [ > ]
```

- Left/right arrows step through months
- Tapping the label opens a year picker (dropdown or scrollable list)
- Defaults to the current month on load
- "All Time" toggle button beside the nav resets to the full history view (last 6 months + category totals across all time)

## Implementation Plan

### Step 1 — Filter state (`src/features/trends/TrendsPage.tsx`)

Add local state for the selected filter:

```ts
interface TrendsFilter {
  mode: 'month' | 'all';
  year: number;
  month: number; // 0-indexed (Jan = 0)
}
```

Default: `{ mode: 'month', year: currentYear, month: currentMonth }`.

### Step 2 — Pass filter to `useTrends`

Update `useTrends` to accept an optional filter parameter:

```ts
export function useTrends(filter?: TrendsFilter): UseTrendsResult
```

- `mode: 'all'` — current behaviour (last 6 months, all-time categories)
- `mode: 'month'` — filter expenses to the selected year+month only:
  - Monthly chart: show daily totals for the selected month (X axis: day number)
  - Category chart: category totals for that month only

### Step 3 — Month nav component (`src/features/trends/MonthNav.tsx`)

Small presentational component:

```tsx
export interface MonthNavProps {
  year: number;
  month: number;        // 0-indexed
  mode: 'month' | 'all';
  onPrev: () => void;
  onNext: () => void;
  onToggleAll: () => void;
}
```

- Disable "next" arrow when selected month === current month
- Show "All Time" as a pill toggle; active when `mode === 'all'`

### Step 4 — Daily breakdown chart (month mode)

When a specific month is selected:
- X axis: day of month (1–31)
- Y axis: PHP amount
- Same red bar chart style
- Empty days are still shown as zero-height bars (so the X axis stays consistent)

### Step 5 — Stories and tests

- `MonthNav.stories.ts`: Default (mid-year), CurrentMonth (next disabled), AllTimeMode
- `use-trends.test.ts`: add cases for month-filtered daily breakdown and category totals filtered by month

## Acceptance Criteria

- [ ] Filter bar visible at top of Trends page
- [ ] Left/right arrows step one month at a time; next arrow disabled on current month
- [ ] "All Time" toggle restores the last-6-months + full category view
- [ ] Monthly chart switches to daily breakdown when a specific month is selected
- [ ] Category chart filters to selected month only
- [ ] No extra DB calls — filtering is purely client-side from the already-fetched expenses
- [ ] `MonthNav` component has stories for all 3 states
- [ ] New filter logic covered by unit tests

## Notes

- No DB change required — all filtering is client-side
- Keep the existing `getExpenses()` call as-is; filter in the hook before computing charts

---
*Added: 2026-06-20*
