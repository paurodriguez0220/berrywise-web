import React, { useEffect, useState } from 'react';
import type { Member } from '../../types';
import type { NewSplit } from '../../db/splits';

type SplitType = 'equal' | 'custom';

export interface AddExpenseModalProps {
  members: Member[];
  onSave: (description: string, amount: number, paidBy: number, splits: NewSplit[]) => Promise<void>;
  onClose: () => void;
}

export function AddExpenseModal({ members, onSave, onClose }: AddExpenseModalProps): React.JSX.Element {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<number | null>(members[0]?.id ?? null);
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [customShares, setCustomShares] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  useEffect(() => {
    setPaidBy(members[0]?.id ?? null);
    const initial: Record<number, string> = {};
    members.forEach((m) => { initial[m.id] = ''; });
    setCustomShares(initial);
  }, [members]);

  // Returns splits array on success, error message string on failure.
  function buildSplits(): NewSplit[] | string {
    const total = parseFloat(amount);
    if (isNaN(total) || total <= 0) return 'Enter a valid amount';

    if (splitType === 'equal') {
      const base = parseFloat((total / members.length).toFixed(2));
      // Assign the floating-point remainder to the first member so splits sum exactly to total.
      const remainder = parseFloat((total - base * members.length).toFixed(2));
      return members.map((m, i) => ({
        memberId: m.id,
        share: i === 0 ? parseFloat((base + remainder).toFixed(2)) : base,
      }));
    }

    const splits: NewSplit[] = members.map((m) => ({
      memberId: m.id,
      share: parseFloat(customShares[m.id] ?? '0') || 0,
    }));
    const sum = splits.reduce((acc, s) => acc + s.share, 0);
    if (Math.abs(sum - total) > 0.01) {
      return `Shares must add up to $${total.toFixed(2)} (current: $${sum.toFixed(2)})`;
    }
    return splits;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setValidationError(undefined);
    if (!description.trim()) { setValidationError('Description is required'); return; }
    const total = parseFloat(amount);
    if (isNaN(total) || total <= 0) { setValidationError('Enter a valid amount'); return; }
    if (paidBy === null) { setValidationError('Select who paid'); return; }
    const result = buildSplits();
    if (typeof result === 'string') { setValidationError(result); return; }
    setIsSaving(true);
    try {
      await onSave(description.trim(), total, paidBy, result);
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-[env(safe-area-inset-bottom)] shadow-xl">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Add Expense</h2>
          <button onClick={onClose} className="min-h-11 min-w-11 flex items-center justify-center text-gray-400 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="min-h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount ($)"
            min="0.01"
            step="0.01"
            className="min-h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <select
            value={paidBy ?? ''}
            onChange={(e) => setPaidBy(e.target.value ? Number(e.target.value) : null)}
            className="min-h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name} paid</option>
            ))}
          </select>

          {/* Split type toggle */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {(['equal', 'custom'] as SplitType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSplitType(type)}
                className={`flex-1 min-h-11 text-sm font-medium transition ${
                  splitType === type
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-500'
                }`}
              >
                {type === 'equal' ? 'Split equally' : 'Custom split'}
              </button>
            ))}
          </div>

          {splitType === 'custom' && (
            <div className="flex flex-col gap-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-gray-700">{m.name}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={customShares[m.id] ?? ''}
                    onChange={(e) =>
                      setCustomShares((prev) => ({ ...prev, [m.id]: e.target.value }))
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-24 min-h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 text-right focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              ))}
            </div>
          )}

          {validationError && (
            <p className="text-sm text-red-500">{validationError}</p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="min-h-12 rounded-xl bg-red-500 text-white font-medium text-sm active:scale-95 transition disabled:opacity-50 mt-1"
          >
            {isSaving ? 'Saving…' : 'Save Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}
