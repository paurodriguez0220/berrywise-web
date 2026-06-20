export interface Member {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: number;
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
