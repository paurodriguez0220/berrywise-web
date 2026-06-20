# Task: Edit and Delete Transactions

**Status:** Defined

## Goal

Allow users to correct or remove an expense after it has been saved.

## Context

Currently there is no way to fix a mistake — wrong amount, wrong payer, typo in description. The only workaround is adding a settlement entry. Edit and delete directly address this gap and are table-stakes for a usable expense tracker.

## Implementation Plan

### Step 1 — DB layer

`src/db/expenses.ts`:
```ts
export async function updateExpense(
  id: number, description: string, amount: number, paidBy: number,
): Promise<void>

export async function deleteExpense(id: number): Promise<void>
```

`src/db/splits.ts`:
```ts
export async function deleteSplitsForExpense(expenseId: number): Promise<void>
```

For edit: `db.batch([deleteSplitsForExpense sql, updateExpense sql])` then `addSplits` after.
For delete: `db.batch([deleteSplitsForExpense sql, deleteExpense sql])` atomically.

### Step 2 — AddExpenseModal — edit mode

Add optional `initialValues` prop:
```ts
export interface AddExpenseModalProps {
  // ...existing...
  initialValues?: { id: number; description: string; amount: number; paidBy: number; splits: NewSplit[] };
}
```

When `initialValues` is present:
- Title changes to "Edit Expense"
- Fields pre-filled
- Save calls `deleteSplitsForExpense` → `updateExpense` → `addSplits` (not `addExpense`)
- Show a Delete button that calls `deleteExpense` + `deleteSplitsForExpense` with a confirmation step

### Step 3 — ExpensesPage

- Tap any expense card → fetch its splits via `getSplitsForExpense(id)` → open `AddExpenseModal` with `initialValues`
- After save or delete: call `refetch()` on `useExpenses`

### Step 4 — use-expenses hook

Expose `update` and `remove` alongside `add`:
```ts
update: (id: number, description: string, amount: number, paidBy: number, splits: NewSplit[]) => Promise<void>
remove: (id: number) => Promise<void>
```

## Acceptance Criteria

- [ ] Tapping an expense card opens a pre-filled edit modal
- [ ] Saving an edit updates the expense and its splits; expense list and balances refresh
- [ ] Deleting an expense removes it and all its splits; balances update
- [ ] Delete requires a confirmation step before executing
- [ ] No orphaned `expense_splits` rows remain after any edit or delete
- [ ] Errors shown in UI if update or delete fails

---
*Added: 2026-06-20*
