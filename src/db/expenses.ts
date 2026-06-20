import { db } from './client';
import type { Expense } from '../types';

export async function getExpenses(): Promise<Expense[]> {
  const result = await db.execute(
    'SELECT id, description, amount, paid_by, created_at FROM expenses ORDER BY created_at DESC',
  );
  return result.rows.map((row) => ({
    id: row.id as number,
    description: row.description as string,
    amount: row.amount as number,
    paidBy: row.paid_by as number,
    createdAt: row.created_at as string,
  }));
}

export async function addExpense(
  description: string,
  amount: number,
  paidBy: number,
): Promise<number> {
  const result = await db.execute({
    sql: 'INSERT INTO expenses (description, amount, paid_by) VALUES (?, ?, ?)',
    args: [description, amount, paidBy],
  });
  return Number(result.lastInsertRowid);
}
