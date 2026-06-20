import { useCallback, useEffect, useState } from 'react';
import { getExpenses } from '../../db/expenses';

export interface TrendPoint {
  label: string;
  total: number;
}

interface UseTrendsResult {
  points: TrendPoint[];
  isLoading: boolean;
  error: string | undefined;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_TO_SHOW = 6;

export function useTrends(): UseTrendsResult {
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const expenses = await getExpenses();
      const totals = new Map<string, number>();

      expenses.forEach((e) => {
        const d = new Date(e.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
        totals.set(key, (totals.get(key) ?? 0) + e.amount);
      });

      const sorted = Array.from(totals.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-MONTHS_TO_SHOW)
        .map(([key, total]) => {
          const monthIndex = parseInt(key.split('-')[1], 10);
          return { label: MONTH_LABELS[monthIndex], total: parseFloat(total.toFixed(2)) };
        });

      setPoints(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trends');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { points, isLoading, error };
}
