# Task: Change Currency to Philippine Peso (₱)

**Status:** Defined

## Goal

Replace all `$` currency symbols with `₱` and centralise amount formatting so the change is made in one place.

## Context

BerryWise is used by a Philippine group. Showing `$` is misleading. No data migration is needed — amounts are stored as plain numbers in Turso.

## Implementation Plan

### Step 1 — Shared formatter

`src/utils/currency.ts`:
```ts
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
}
```

### Step 2 — Replace all inline `$` formatting

| File | Current | Replace with |
|---|---|---|
| `ExpensesPage.tsx` | `$${expense.amount.toFixed(2)}` | `formatCurrency(expense.amount)` |
| `AddExpenseModal.tsx` | `$${total.toFixed(2)}` in validation message | `formatCurrency(total)` |
| `BalancesPage.tsx` | `+$${b.net.toFixed(2)}` / `-$${...}` | `formatCurrency(Math.abs(b.net))` with sign prefix |
| `SettlePage.tsx` | `$${s.amount.toFixed(2)}` | `formatCurrency(s.amount)` |

## Acceptance Criteria

- [ ] No raw `$` currency symbols remain in rendered UI
- [ ] All amounts display with `₱` prefix via `formatCurrency`
- [ ] `formatCurrency` is the single source of formatting — no inline `.toFixed` for display

---
*Added: 2026-06-20*
