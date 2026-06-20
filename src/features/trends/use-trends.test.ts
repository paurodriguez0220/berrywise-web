import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../../db/expenses', () => ({
  getExpenses: vi.fn(),
}));

import { getExpenses } from '../../db/expenses';
import { useTrends } from './use-trends';

const mockGetExpenses = vi.mocked(getExpenses);

function makeExpense(amount: number, createdAt: string, id = 1, category = 'other' as const) {
  return { id, description: 'Test', amount, paidBy: 1, category, createdAt };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('useTrends — monthly points', () => {
  it('returns empty points when there are no expenses', async () => {
    mockGetExpenses.mockResolvedValue([]);
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.points).toEqual([]);
    expect(result.current.categoryPoints).toEqual([]);
  });

  it('groups expenses by month and sums totals', async () => {
    mockGetExpenses.mockResolvedValue([
      makeExpense(100, '2025-01-10T00:00:00.000Z', 1),
      makeExpense(200, '2025-01-20T00:00:00.000Z', 2),
      makeExpense(50,  '2025-02-05T00:00:00.000Z', 3),
    ]);
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.points).toHaveLength(2);
    expect(result.current.points[0]).toMatchObject({ label: 'Jan', total: 300 });
    expect(result.current.points[1]).toMatchObject({ label: 'Feb', total: 50 });
  });

  it('limits output to the last 6 months when there is more data', async () => {
    const expenses = Array.from({ length: 8 }, (_, i) =>
      makeExpense(100, `2024-${String(i + 1).padStart(2, '0')}-01T00:00:00.000Z`, i + 1),
    );
    mockGetExpenses.mockResolvedValue(expenses);
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.points).toHaveLength(6);
    expect(result.current.points[0].label).toBe('Mar');
    expect(result.current.points[5].label).toBe('Aug');
  });

  it('returns points in ascending month order', async () => {
    mockGetExpenses.mockResolvedValue([
      makeExpense(50,  '2025-03-01T00:00:00.000Z', 1),
      makeExpense(100, '2025-01-01T00:00:00.000Z', 2),
      makeExpense(75,  '2025-02-01T00:00:00.000Z', 3),
    ]);
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const labels = result.current.points.map((p) => p.label);
    expect(labels).toEqual(['Jan', 'Feb', 'Mar']);
  });

  it('sets error when getExpenses rejects', async () => {
    mockGetExpenses.mockRejectedValue(new Error('DB error'));
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('DB error');
    expect(result.current.points).toEqual([]);
  });
});

describe('useTrends — category points', () => {
  it('groups expenses by category and sums totals', async () => {
    mockGetExpenses.mockResolvedValue([
      makeExpense(500, '2025-01-01T00:00:00.000Z', 1, 'food'),
      makeExpense(300, '2025-01-02T00:00:00.000Z', 2, 'food'),
      makeExpense(200, '2025-01-03T00:00:00.000Z', 3, 'grocery'),
    ]);
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const food = result.current.categoryPoints.find((p) => p.value === 'food');
    const grocery = result.current.categoryPoints.find((p) => p.value === 'grocery');
    expect(food?.total).toBe(800);
    expect(grocery?.total).toBe(200);
  });

  it('only includes categories with a non-zero total', async () => {
    mockGetExpenses.mockResolvedValue([
      makeExpense(100, '2025-01-01T00:00:00.000Z', 1, 'rent'),
    ]);
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.categoryPoints).toHaveLength(1);
    expect(result.current.categoryPoints[0].value).toBe('rent');
  });

  it('sorts categories by total descending', async () => {
    mockGetExpenses.mockResolvedValue([
      makeExpense(100, '2025-01-01T00:00:00.000Z', 1, 'grocery'),
      makeExpense(500, '2025-01-02T00:00:00.000Z', 2, 'rent'),
      makeExpense(200, '2025-01-03T00:00:00.000Z', 3, 'food'),
    ]);
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const totals = result.current.categoryPoints.map((p) => p.total);
    expect(totals).toEqual([...totals].sort((a, b) => b - a));
  });

  it('gives berry category a purple fill color', async () => {
    mockGetExpenses.mockResolvedValue([
      makeExpense(100, '2025-01-01T00:00:00.000Z', 1, 'berry'),
    ]);
    const { result } = renderHook(() => useTrends());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const berry = result.current.categoryPoints.find((p) => p.value === 'berry');
    expect(berry?.fill).toBe('#7c3aed');
  });
});
