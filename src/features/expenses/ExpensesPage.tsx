import React, { useState } from 'react';
import { useExpenses } from './use-expenses';
import { useMembers } from '../members/use-members';
import { AddExpenseModal, type InitialExpenseValues } from './AddExpenseModal';
import { getSplitsForExpense } from '../../db/splits';
import { formatCurrency } from '../../utils/currency';
import type { Expense } from '../../types';

export function ExpensesPage(): React.JSX.Element {
  const { expenses, isLoading, error, add, update, remove } = useExpenses();
  const { members } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<InitialExpenseValues | null>(null);
  const [loadingExpenseId, setLoadingExpenseId] = useState<number | null>(null);
  const [tapError, setTapError] = useState<string | undefined>();

  function getMemberName(id: number): string {
    return members.find((m) => m.id === id)?.name ?? 'Unknown';
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  async function handleTapExpense(expense: Expense): Promise<void> {
    setLoadingExpenseId(expense.id);
    setTapError(undefined);
    try {
      const splits = await getSplitsForExpense(expense.id);
      setEditingExpense({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy,
        splits: splits.map((s) => ({ memberId: s.memberId, share: s.share })),
      });
    } catch (err) {
      setTapError(err instanceof Error ? err.message : 'Failed to load expense');
    } finally {
      setLoadingExpenseId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
      <h1 className="text-xl font-semibold text-gray-900">Expenses</h1>

      {(error ?? tapError) && <p className="text-sm text-red-500">{error ?? tapError}</p>}

      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
      ) : expenses.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No expenses yet. Tap + to add one.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              onClick={() => { if (!loadingExpenseId) void handleTapExpense(expense); }}
              className={`flex items-center justify-between min-h-16 rounded-xl bg-white border border-gray-100 px-4 shadow-sm transition active:scale-[0.98] ${
                loadingExpenseId === expense.id ? 'opacity-50' : 'cursor-pointer'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-gray-900">{expense.description}</span>
                <span className="text-xs text-gray-400">
                  {getMemberName(expense.paidBy)} paid · {formatDate(expense.createdAt)}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4 w-14 h-14 rounded-full bg-red-500 text-white text-2xl shadow-lg active:scale-95 transition flex items-center justify-center"
        aria-label="Add expense"
      >
        +
      </button>

      {/* Add modal */}
      {isModalOpen && members.length > 0 && (
        <AddExpenseModal
          members={members}
          onSave={add}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isModalOpen && members.length === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <p className="text-sm text-gray-600 mb-4">Add at least one member before logging an expense.</p>
            <button onClick={() => setIsModalOpen(false)} className="min-h-11 px-6 rounded-xl bg-red-500 text-white text-sm font-medium">
              OK
            </button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingExpense && members.length > 0 && (
        <AddExpenseModal
          members={members}
          initialValues={editingExpense}
          onSave={async (desc, amt, paidBy, splits) => {
            await update(editingExpense.id, desc, amt, paidBy, splits);
          }}
          onDelete={async (id) => {
            await remove(id);
          }}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}
