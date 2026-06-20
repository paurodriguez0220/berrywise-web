import React, { useState } from 'react';
import { BottomNav } from './BottomNav';
import { MembersPage } from '../features/members/MembersPage';
import { ExpensesPage } from '../features/expenses/ExpensesPage';
import { BalancesPage } from '../features/balances/BalancesPage';
import { TrendsPage } from '../features/trends/TrendsPage';

export type Tab = 'members' | 'expenses' | 'balances' | 'trends';

export function Layout(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('expenses');

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      {/* Safe-area top spacer */}
      <div className="pt-[env(safe-area-inset-top)]" />

      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'members' && <MembersPage />}
        {activeTab === 'expenses' && <ExpensesPage />}
        {activeTab === 'balances' && <BalancesPage />}
        {activeTab === 'trends' && <TrendsPage />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
