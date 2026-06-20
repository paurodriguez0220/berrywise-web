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

function buildCategoryPoints(expenses: ReturnType<typeof Array.prototype.filter>): CategoryPoint[] {
  const catTotals = new Map<ExpenseCategory, number>();
  expenses.forEach((e: { category: ExpenseCategory; amount: number }) => {
    catTotals.set(e.category, (catTotals.get(e.category) ?? 0) + e.amount);
  });
  return CATEGORIES
    .map((cat) => ({
      ...cat,
      total: parseFloat((catTotals.get(cat.value) ?? 0).toFixed(2)),
      fill: cat.value === 'berry' ? BERRY_COLOR : DEFAULT_COLOR,
    }))
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total);
}

export function useTrends(
  mode: 'all' | 'month' = 'all',
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth(),
): UseTrendsResult {
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [categoryPoints, setCategoryPoints] = useState<CategoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const expenses = await getExpenses();

      if (mode === 'all') {
        // Monthly totals — last 6 months
        const monthTotals = new Map<string, number>();
        expenses.forEach((e) => {
          const d = new Date(e.createdAt);
          const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()).padStart(2, '0')}`;
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
        setCategoryPoints(buildCategoryPoints(expenses));
      } else {
        // Daily totals for selected month
        const filtered = expenses.filter((e) => {
          const d = new Date(e.createdAt);
          return d.getUTCFullYear() === year && d.getUTCMonth() === month;
        });
        const dayTotals = new Map<number, number>();
        filtered.forEach((e) => {
          const day = new Date(e.createdAt).getUTCDate();
          dayTotals.set(day, (dayTotals.get(day) ?? 0) + e.amount);
        });
        const daily = Array.from(dayTotals.entries())
          .sort(([a], [b]) => a - b)
          .map(([day, total]) => ({ label: String(day), total: parseFloat(total.toFixed(2)) }));
        setPoints(daily);
        setCategoryPoints(buildCategoryPoints(filtered));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trends');
    } finally {
      setIsLoading(false);
    }
  }, [mode, year, month]);

  useEffect(() => {
    void load();
  }, [load]);

  return { points, categoryPoints, isLoading, error };
}
