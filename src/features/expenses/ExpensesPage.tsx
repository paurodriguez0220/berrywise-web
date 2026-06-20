import React, { useState } from 'react';
import { useExpenses } from './use-expenses';
import { useMembers } from '../members/use-members';
import { AddExpenseModal } from './AddExpenseModal';
import { formatCurrency } from '../../utils/currency';

export function ExpensesPage(): React.JSX.Element {
  const { expenses, isLoading, error, add } = useExpenses();
  const { members } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function getMemberName(id: number): string {
    return members.find((m) => m.id === id)?.name ?? 'Unknown';
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
      <h1 className="text-xl font-semibold text-gray-900">Expenses</h1>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
      ) : expenses.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No expenses yet. Tap + to add one.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between min-h-16 rounded-xl bg-white border border-gray-100 px-4 shadow-sm"
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
    </div>
  );
}
