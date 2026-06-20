import { useCallback, useEffect, useState } from 'react';
import { getExpenses } from '../../db/expenses';
import { CATEGORIES, type ExpenseCategory } from '../../types';

export interface TrendPoint {
  label: string;
  total: number;
}

export interface CategoryPoint {
  value: ExpenseCategory;
  label: string;
  emoji: string;
  total: number;
  fill: string;
}

interface UseTrendsResult {
  points: TrendPoint[];
  categoryPoints: CategoryPoint[];
  isLoading: boolean;
  error: string | undefined;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_TO_SHOW = 6;
const BERRY_COLOR = '#7c3aed';
const DEFAULT_COLOR = '#e63946';

export function useTrends(): UseTrendsResult {
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [categoryPoints, setCategoryPoints] = useState<CategoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const expenses = await getExpenses();

      // Monthly totals
      const monthTotals = new Map<string, number>();
      expenses.forEach((e) => {
        const d = new Date(e.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
        monthTotals.set(key, (monthTotals.get(key) ?? 0) + e.amount);
      });
      const sorted = Array.from(monthTotals.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-MONTHS_TO_SHOW)
        .map(([key, total]) => {
          const monthIndex = parseInt(key.split('-')[1], 10);
          return { label: MONTH_LABELS[monthIndex], total: parseFloat(total.toFixed(2)) };
        });
      setPoints(sorted);

      // Category totals
      const catTotals = new Map<ExpenseCategory, number>();
      expenses.forEach((e) => {
        catTotals.set(e.category, (catTotals.get(e.category) ?? 0) + e.amount);
      });
      const cats = CATEGORIES
        .map((cat) => ({
          ...cat,
          total: parseFloat((catTotals.get(cat.value) ?? 0).toFixed(2)),
          fill: cat.value === 'berry' ? BERRY_COLOR : DEFAULT_COLOR,
        }))
        .filter((p) => p.total > 0)
        .sort((a, b) => b.total - a.total);
      setCategoryPoints(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trends');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { points, categoryPoints, isLoading, error };
}
