export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  type: 'Cash' | 'Bank' | 'Savings' | 'Credit';
  balance: number;
  color: string;
  created_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  wallet_id?: string | null;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  created_at?: string;
}

export interface Income {
  id: string;
  user_id: string;
  wallet_id?: string | null;
  amount: number;
  source: string;
  date: string; // YYYY-MM-DD
  created_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  action_taken?: {
    type: 'ADD_EXPENSE' | 'ADD_INCOME' | 'SET_BUDGET';
    details: Record<string, any>;
  } | null;
  created_at: string;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
  color: string;
  icon?: string;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
  dailyAllowance: number;
  categories: CategoryBreakdown[];
}

export interface BudgetStatus {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percent: number;
  isExceeded: boolean;
  color: string;
}

export type TransactionType = 'Expense' | 'Income';

export interface UnifiedTransaction {
  id: string;
  type: TransactionType;
  category: string; // or source
  amount: number;
  description: string;
  date: string;
  wallet_id?: string | null;
}
