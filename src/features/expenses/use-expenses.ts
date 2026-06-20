import { useCallback, useEffect, useState } from 'react';
import { getExpenses, addExpense } from '../../db/expenses';
import { addSplits, type NewSplit } from '../../db/splits';
import type { Expense } from '../../types';

interface UseExpensesResult {
  expenses: Expense[];
  isLoading: boolean;
  error: string | undefined;
  add: (description: string, amount: number, paidBy: number, splits: NewSplit[]) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useExpenses(): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      setExpenses(await getExpenses());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const add = useCallback(
    async (
      description: string,
      amount: number,
      paidBy: number,
      splits: NewSplit[],
    ): Promise<void> => {
      const expenseId = await addExpense(description, amount, paidBy);
      await addSplits(expenseId, splits);
      await refetch();
    },
    [refetch],
  );

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { expenses, isLoading, error, add, refetch };
}
