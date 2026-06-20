import React from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface MonthNavProps {
  year: number;
  month: number;
  mode: 'all' | 'month';
  onPrev: () => void;
  onNext: () => void;
  onToggleAll: () => void;
}

export function MonthNav({ year, month, mode, onPrev, onNext, onToggleAll }: MonthNavProps): React.JSX.Element {
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const isAllMode = mode === 'all';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggleAll}
        className={`px-3 min-h-8 rounded-full text-xs font-medium transition active:scale-95 ${
          isAllMode ? 'bg-red-500 text-white' : 'border border-gray-200 text-gray-500'
        }`}
      >
        All Time
      </button>

      <div className="flex items-center gap-1 ml-auto">
        <button
          type="button"
          onClick={onPrev}
          disabled={isAllMode}
          className="min-h-9 min-w-9 flex items-center justify-center rounded-xl text-xl text-gray-400 active:bg-gray-100 transition disabled:opacity-30"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
          {isAllMode ? 'All Time' : `${MONTH_NAMES[month]} ${year}`}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={isCurrentMonth || isAllMode}
          className="min-h-9 min-w-9 flex items-center justify-center rounded-xl text-xl text-gray-400 active:bg-gray-100 transition disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </div>
  );
}
