import { db } from './client';
import type { Expense, ExpenseCategory } from '../types';

export async function getExpenses(): Promise<Expense[]> {
  const result = await db.execute(
    'SELECT id, description, amount, paid_by, category, created_at FROM expenses ORDER BY created_at DESC',
  );
  return result.rows.map((row) => ({
    id: row.id as number,
    description: row.description as string,
    amount: row.amount as number,
    paidBy: row.paid_by as number,
    category: (row.category as string ?? 'other') as ExpenseCategory,
    createdAt: row.created_at as string,
  }));
}

export async function addExpense(
  description: string,
  amount: number,
  paidBy: number,
  category: ExpenseCategory,
): Promise<number> {
  const result = await db.execute({
    sql: 'INSERT INTO expenses (description, amount, paid_by, category) VALUES (?, ?, ?, ?)',
    args: [description, amount, paidBy, category],
  });
  return Number(result.lastInsertRowid);
}

export async function updateExpense(
  id: number,
  description: string,
  amount: number,
  paidBy: number,
  category: ExpenseCategory,
): Promise<void> {
  await db.execute({
    sql: 'UPDATE expenses SET description = ?, amount = ?, paid_by = ?, category = ? WHERE id = ?',
    args: [description, amount, paidBy, category, id],
  });
}

export async function deleteExpense(id: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM expenses WHERE id = ?',
    args: [id],
  });
}
