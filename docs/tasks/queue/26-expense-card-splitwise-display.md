# Task: Expense Card Splitwise-style Display

**Status:** Queue

## Goal

Change the expense card subtitle to show who is owed what — the same way Splitwise presents it — so users can understand the impact of each expense at a glance without opening the edit modal.

## Desired Display

**Equal split, Paulo paid:**
```
🍽️  Dinner at Jollibee                    ₱300
     Paulo paid, split equally
     Paulo is owed ₱200
```

**Equal split, Gene paid:**
```
🍽️  Dinner at Jollibee                    ₱300
     Gene paid, split equally
     Gene is owed ₱200
```

**Custom split:**
```
🏠  Rent                                  ₱5,000
     Paulo paid
     Paulo is owed ₱2,500
```

The "is owed" amount = expense amount − payer's own share.

## Implementation Plan

### Step 1 — Load splits alongside expenses

Currently `getExpenses()` only fetches the `expenses` table. To compute "is owed ₱X" for each card without an extra DB round-trip per expense, load all splits once and join client-side.

Update `useExpenses` to also call `getAllSplits()` and attach each expense's splits:

```ts
export interface ExpenseWithSplits extends Expense {
  splits: Split[];
}
```

Or keep them separate and join in the hook: `splits.filter(s => s.expenseId === expense.id)`.

`getAllSplits()` already exists in `src/db/splits.ts` — no DB change needed.

### Step 2 — Compute "owed" amount

```ts
function owedAmount(expense: Expense, splits: Split[]): number {
  const payerSplit = splits.find(s => s.memberId === expense.paidBy);
  return parseFloat((expense.amount - (payerSplit?.share ?? 0)).toFixed(2));
}
```

### Step 3 — Detect split type label

```ts
function splitLabel(expense: Expense, splits: Split[], memberCount: number): string {
  const isEqual = splits.length === memberCount &&
    splits.every(s => Math.abs(s.share - splits[0].share) < 0.02);
  return isEqual ? 'split equally' : '';
}
```

### Step 4 — Update ExpensesPage card

Replace the current single subtitle line:

```
Gene paid · Jun 20
```

With two lines:

```
Gene paid, split equally · Jun 20
Gene is owed ₱200
```

If owed amount is 0 (payer paid only for themselves), show nothing on the second line.

### Step 5 — Update use-expenses hook

Expose splits alongside expenses so ExpensesPage can compute the owed label without extra fetches:

```ts
interface UseExpensesResult {
  expenses: Expense[];
  splits: Split[];   // all splits, joined client-side
  // ...rest unchanged
}
```

### Step 6 — Stories and tests

- Update `ExpensesPage.stories.ts` (if it exists) or create it with:
  - `EqualSplit` — payer is owed partial amount
  - `FullOwed` — solo payer, owes 0 to self
  - `CustomSplit` — unequal amounts
- Unit test: `owedAmount()` and `splitLabel()` helper functions

## Acceptance Criteria

- [ ] Expense cards show "[Name] paid, split equally" (or "[Name] paid" for custom)
- [ ] Second line shows "[Name] is owed ₱X" when owed > 0
- [ ] No extra DB round-trip per expense — splits fetched once alongside expenses
- [ ] Settlement expenses (description starts with "Settlement:") show no "owed" line
- [ ] All existing tests pass

## Notes

- No DB schema change required
- `getAllSplits()` already exists — the only change is calling it in `useExpenses`
- Settlement expense records created by "Mark Settled" should be excluded from the owed display since they zero out debt, not create it

---
*Added: 2026-06-20*
