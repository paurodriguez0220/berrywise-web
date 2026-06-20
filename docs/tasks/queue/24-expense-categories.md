# Task: Expense Categories

**Status:** Queue

## Goal

Let users tag each expense with a category so spending can be organized and filtered at a glance.

## Categories

| Value | Label | Emoji |
|---|---|---|
| `food` | Food | 🍽️ |
| `transpo` | Transport | 🚗 |
| `rent` | Rent | 🏠 |
| `grocery` | Grocery | 🛒 |
| `berry` | Berry | 👶 |
| `other` | Other | 📦 |

`berry` is a custom category for baby expenses — treated the same as any other category in the data layer, just styled distinctly.

## DB Change (manual — run in Turso before deploying)

```sql
ALTER TABLE expenses ADD COLUMN category TEXT NOT NULL DEFAULT 'other';
```

No migration tool needed — SQLite `ALTER TABLE ADD COLUMN` with a `DEFAULT` is safe on existing rows.

## Implementation Plan

### Step 1 — Types (`src/types/index.ts`)

```ts
export type ExpenseCategory = 'food' | 'transpo' | 'rent' | 'grocery' | 'berry' | 'other';

export const CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'food',    label: 'Food',      emoji: '🍽️' },
  { value: 'transpo', label: 'Transport', emoji: '🚗' },
  { value: 'rent',    label: 'Rent',      emoji: '🏠' },
  { value: 'grocery', label: 'Grocery',   emoji: '🛒' },
  { value: 'berry',   label: 'Berry',     emoji: '👶' },
  { value: 'other',   label: 'Other',     emoji: '📦' },
];

export interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: number;
  category: ExpenseCategory;
  createdAt: string;
}
```

### Step 2 — DB layer (`src/db/expenses.ts`)

- `getExpenses`: add `category` to SELECT and map it
- `addExpense`: add `category` parameter, include in INSERT
- `updateExpense`: add `category` parameter, include in UPDATE

### Step 3 — AddExpenseModal

Add a category picker row (horizontally scrollable pill buttons) between Description and Amount:

```
[🍽️ Food] [🚗 Transpo] [🏠 Rent] [🛒 Grocery] [🫐 Berry] [📦 Other]
```

- Default selection: `other`
- Selected pill: red background (`bg-red-500 text-white`)
- Unselected: gray border
- `berry` pill: blueberry-tinted border (`border-purple-300`) to make it stand out

Edit mode: pre-select from `initialValues.category`.

### Step 4 — ExpensesPage

Show category emoji badge on each expense card, to the left of the description:

```
[🍽️]  Dinner at Jollibee          ₱850
        Paulo paid · Jun 20
```

### Step 5 — Trends (required)

Update `TrendsPage` to add a second chart: "By Category" — a bar or pie chart showing total spend per category across all time (or current month toggle).

- Add a `pointsByCategory: CategoryPoint[]` output to `use-trends`:
  ```ts
  export interface CategoryPoint {
    category: ExpenseCategory;
    label: string;
    emoji: string;
    total: number;
  }
  ```
- Display as a horizontal bar chart (easier to read labels on mobile) or a donut chart
- `berry` bar/slice uses a distinct purple color (`#7c3aed`) instead of the app red
- Empty state: "No expenses yet" (same as monthly chart)

### Step 6 — use-expenses hook

Update `add` and `update` signatures to include `category: ExpenseCategory`.

## Acceptance Criteria

- [ ] DB column added via `ALTER TABLE` before deploy
- [ ] Category picker visible in AddExpenseModal, defaults to Other
- [ ] Berry category has a distinct visual treatment
- [ ] Category saved and loaded correctly (edit modal shows pre-selected category)
- [ ] Expense list shows emoji badge per category
- [ ] All existing expenses (category = 'other') render without error
- [ ] `CATEGORIES` constant is the single source of truth — no category strings hardcoded elsewhere
- [ ] Trends page shows a "By Category" chart alongside the monthly chart
- [ ] Berry slice/bar uses purple (`#7c3aed`) to stand out visually

## Notes

- No new DB table — single TEXT column with a default is the lightest possible change
- The `berry` category is purely a display/filter concern; it behaves identically to any other category in the balance and settlement calculations

---
*Added: 2026-06-20*
