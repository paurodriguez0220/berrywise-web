import { useCallback, useEffect, useState } from 'react';
import { getExpenses } from '../../db/expenses';
import { getAllSplits } from '../../db/splits';
import { getMembers } from '../../db/members';
import type { Balance } from '../../types';

interface UseBalancesResult {
  balances: Balance[];
  isLoading: boolean;
  error: string | undefined;
  refetch: () => Promise<void>;
}

export function useBalances(): UseBalancesResult {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const [members, expenses, splits] = await Promise.all([
        getMembers(),
        getExpenses(),
        getAllSplits(),
      ]);

      const paid = new Map<number, number>();
      const owed = new Map<number, number>();
      members.forEach((m) => { paid.set(m.id, 0); owed.set(m.id, 0); });

      expenses.forEach((e) => {
        paid.set(e.paidBy, (paid.get(e.paidBy) ?? 0) + e.amount);
      });

      splits.forEach((s) => {
        owed.set(s.memberId, (owed.get(s.memberId) ?? 0) + s.share);
      });

      setBalances(
        members.map((m) => ({
          memberId: m.id,
          name: m.name,
          net: parseFloat(((paid.get(m.id) ?? 0) - (owed.get(m.id) ?? 0)).toFixed(2)),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate balances');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { balances, isLoading, error, refetch };
}
