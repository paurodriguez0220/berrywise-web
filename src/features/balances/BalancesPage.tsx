import React from 'react';
import { useBalances } from './use-balances';
import { formatCurrency } from '../../utils/currency';

export function BalancesPage(): React.JSX.Element {
  const { balances, isLoading, error } = useBalances();

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
      <h1 className="text-xl font-semibold text-gray-900">Balances</h1>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
      ) : balances.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Add members and expenses to see balances.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {balances.map((b) => (
            <li
              key={b.memberId}
              className="flex items-center justify-between min-h-14 rounded-xl bg-white border border-gray-100 px-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                  {b.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-gray-900">{b.name}</span>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-semibold ${
                    b.net > 0
                      ? 'text-green-600'
                      : b.net < 0
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                >
                  {b.net > 0 ? `+${formatCurrency(b.net)}` : b.net < 0 ? `-${formatCurrency(Math.abs(b.net))}` : 'Settled'}
                </span>
                <p className="text-xs text-gray-400">
                  {b.net > 0 ? 'is owed' : b.net < 0 ? 'owes' : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
