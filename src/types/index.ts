export interface Member {
  id: number;
  name: string;
}

export type ExpenseCategory = 'food' | 'transpo' | 'rent' | 'grocery' | 'utilities' | 'health' | 'berry' | 'other';

export interface CategoryMeta {
  value: ExpenseCategory;
  label: string;
  emoji: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { value: 'food',      label: 'Food',      emoji: '🍽️' },
  { value: 'transpo',   label: 'Transport',  emoji: '🚗' },
  { value: 'rent',      label: 'Rent',       emoji: '🏠' },
  { value: 'grocery',   label: 'Grocery',    emoji: '🛒' },
  { value: 'utilities', label: 'Utilities',  emoji: '💡' },
  { value: 'health',    label: 'Health',     emoji: '🏥' },
  { value: 'berry',     label: 'Berry',      emoji: '👶' },
  { value: 'other',     label: 'Other',      emoji: '📦' },
];

export interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: number;
  category: ExpenseCategory;
  createdAt: string;
}

export interface Split {
  id: number;
  expenseId: number;
  memberId: number;
  share: number;
}

export interface Balance {
  memberId: number;
  name: string;
  net: number;
}
