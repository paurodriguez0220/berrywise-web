import { useCallback, useEffect, useState } from 'react';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../../db/expenses';
import { addSplits, deleteSplitsForExpense, type NewSplit } from '../../db/splits';
import type { Expense } from '../../types';

interface UseExpensesResult {
  expenses: Expense[];
  isLoading: boolean;
  error: string | undefined;
  add: (description: string, amount: number, paidBy: number, splits: NewSplit[]) => Promise<void>;
  update: (id: number, description: string, amount: number, paidBy: number, splits: NewSplit[]) => Promise<void>;
  remove: (id: number) => Promise<void>;
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
    async (description: string, amount: number, paidBy: number, splits: NewSplit[]): Promise<void> => {
      try {
        const expenseId = await addExpense(description, amount, paidBy);
        await addSplits(expenseId, splits);
        await refetch();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add expense');
        throw err;
      }
    },
    [refetch],
  );

  const update = useCallback(
    async (id: number, description: string, amount: number, paidBy: number, splits: NewSplit[]): Promise<void> => {
      try {
        await deleteSplitsForExpense(id);
        await updateExpense(id, description, amount, paidBy);
        await addSplits(id, splits);
        await refetch();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update expense');
        throw err;
      }
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: number): Promise<void> => {
      try {
        await deleteSplitsForExpense(id);
        await deleteExpense(id);
        await refetch();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete expense');
        throw err;
      }
    },
    [refetch],
  );

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { expenses, isLoading, error, add, update, remove, refetch };
}
