import React, { useState } from 'react';
import { useBalances } from '../balances/use-balances';
import { addExpense } from '../../db/expenses';
import { addSplits } from '../../db/splits';
import { formatCurrency } from '../../utils/currency';

interface Settlement {
  debtorId: number;
  debtorName: string;
  creditorId: number;
  creditorName: string;
  amount: number;
}

function settlementKey(s: Settlement): string {
  return `${s.debtorId}-${s.creditorId}`;
}

export function SettlePage(): React.JSX.Element {
  const { balances, isLoading, error, refetch } = useBalances();
  const [settling, setSettling] = useState<string | null>(null);
  const [settleError, setSettleError] = useState<string | undefined>();

  const debtors = balances.filter((b) => b.net < 0);
  const creditors = balances.filter((b) => b.net > 0);

  function computeSettlements(): Settlement[] {
    const debtQueue = debtors.map((d) => ({ ...d, remaining: Math.abs(d.net) }));
    const credQueue = creditors.map((c) => ({ ...c, remaining: c.net }));
    const result: Settlement[] = [];

    let di = 0;
    let ci = 0;
    while (di < debtQueue.length && ci < credQueue.length) {
      const d = debtQueue[di];
      const c = credQueue[ci];
      const amount = parseFloat(Math.min(d.remaining, c.remaining).toFixed(2));
      result.push({
        debtorId: d.memberId,
        debtorName: d.name,
        creditorId: c.memberId,
        creditorName: c.name,
        amount,
      });
      d.remaining -= amount;
      c.remaining -= amount;
      if (d.remaining < 0.01) di++;
      if (c.remaining < 0.01) ci++;
    }
    return result;
  }

  async function handleSettle(s: Settlement): Promise<void> {
    const key = settlementKey(s);
    setSettling(key);
    setSettleError(undefined);
    try {
      const expenseId = await addExpense(
        `Settlement: ${s.debtorName} → ${s.creditorName}`,
        s.amount,
        s.debtorId,
      );
      await addSplits(expenseId, [{ memberId: s.creditorId, share: s.amount }]);
      await refetch();
    } catch (err) {
      setSettleError(err instanceof Error ? err.message : 'Failed to record settlement');
    } finally {
      setSettling(null);
    }
  }

  const settlements = isLoading ? [] : computeSettlements();

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
      <h1 className="text-xl font-semibold text-gray-900">Settle Up</h1>

      {(error ?? settleError) && (
        <p className="text-sm text-red-500">{error ?? settleError}</p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
      ) : settlements.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          {balances.length === 0 ? 'Add members and expenses first.' : 'Everyone is settled up!'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {settlements.map((s) => (
            <li
              key={settlementKey(s)}
              className="flex items-center justify-between rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm gap-3"
            >
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {s.debtorName} <span className="text-gray-400">→</span> {s.creditorName}
                </span>
                <span className="text-xs text-gray-400">{formatCurrency(s.amount)}</span>
              </div>
              <button
                onClick={() => handleSettle(s)}
                disabled={settling === settlementKey(s)}
                className="min-h-11 px-4 rounded-xl bg-green-500 text-white text-sm font-medium active:scale-95 transition disabled:opacity-50 whitespace-nowrap"
              >
                {settling === settlementKey(s) ? '…' : 'Mark Settled'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
