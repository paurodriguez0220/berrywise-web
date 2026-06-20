import { db } from './client';
import type { Split } from '../types';

export interface NewSplit {
  memberId: number;
  share: number;
}

export async function getSplitsForExpense(expenseId: number): Promise<Split[]> {
  const result = await db.execute({
    sql: 'SELECT id, expense_id, member_id, share FROM expense_splits WHERE expense_id = ?',
    args: [expenseId],
  });
  return result.rows.map((row) => ({
    id: row.id as number,
    expenseId: row.expense_id as number,
    memberId: row.member_id as number,
    share: row.share as number,
  }));
}

export async function getAllSplits(): Promise<Split[]> {
  const result = await db.execute(
    'SELECT id, expense_id, member_id, share FROM expense_splits',
  );
  return result.rows.map((row) => ({
    id: row.id as number,
    expenseId: row.expense_id as number,
    memberId: row.member_id as number,
    share: row.share as number,
  }));
}

export async function addSplits(expenseId: number, splits: NewSplit[]): Promise<void> {
  const statements = splits.map((s) => ({
    sql: 'INSERT INTO expense_splits (expense_id, member_id, share) VALUES (?, ?, ?)',
    args: [expenseId, s.memberId, s.share] as [number, number, number],
  }));
  await db.batch(statements);
}
