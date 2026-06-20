import React from 'react';
import type { Tab } from './Layout';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

interface NavItem {
  tab: Tab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { tab: 'members', label: 'Members', icon: '👥' },
  { tab: 'expenses', label: 'Expenses', icon: '💸' },
  { tab: 'balances', label: 'Balances', icon: '⚖️' },
  { tab: 'trends', label: 'Trends', icon: '📈' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps): React.JSX.Element {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {NAV_ITEMS.map(({ tab, label, icon }) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 flex flex-col items-center justify-center min-h-14 gap-0.5 transition active:scale-95 ${
              activeTab === tab ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
