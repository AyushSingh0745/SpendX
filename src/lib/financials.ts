import { isSupabaseConfigured, supabase, readLocalData, writeLocalData } from './db';
import { Expense, Income, Budget, Wallet, UnifiedTransaction, MonthlySummary, BudgetStatus, CategoryBreakdown } from '@/types';
import { getCategoryColor } from './constants';

export async function getUserWallets(userId: string): Promise<Wallet[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('wallets').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    return data || [];
  }
  const local = readLocalData();
  return local.wallets.filter((w) => w.user_id === userId);
}

export async function getUserExpenses(userId: string): Promise<Expense[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('expenses').select('*').eq('user_id', userId).order('date', { ascending: false });
    return data || [];
  }
  const local = readLocalData();
  return local.expenses.filter((e) => e.user_id === userId).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getUserIncome(userId: string): Promise<Income[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('income').select('*').eq('user_id', userId).order('date', { ascending: false });
    return data || [];
  }
  const local = readLocalData();
  return local.income.filter((i) => i.user_id === userId).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getUserBudgets(userId: string): Promise<Budget[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('budgets').select('*').eq('user_id', userId);
    return data || [];
  }
  const local = readLocalData();
  return local.budgets.filter((b) => b.user_id === userId);
}

export async function getUnifiedTransactions(userId: string): Promise<UnifiedTransaction[]> {
  const [expenses, income] = await Promise.all([getUserExpenses(userId), getUserIncome(userId)]);

  const list: UnifiedTransaction[] = [
    ...expenses.map((e) => ({
      id: e.id,
      type: 'Expense' as const,
      category: e.category,
      amount: Number(e.amount),
      description: e.description || '',
      date: e.date,
      wallet_id: e.wallet_id,
    })),
    ...income.map((i) => ({
      id: i.id,
      type: 'Income' as const,
      category: i.source,
      amount: Number(i.amount),
      description: 'Income receipt',
      date: i.date,
      wallet_id: i.wallet_id,
    })),
  ];

  return list.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addExpense(
  userId: string,
  data: { amount: number; category: string; description?: string; date: string; wallet_id?: string | null }
): Promise<Expense> {
  const newExp: Expense = {
    id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId,
    amount: Number(data.amount),
    category: data.category,
    description: data.description || '',
    date: data.date,
    wallet_id: data.wallet_id || null,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data: inserted, error } = await supabase.from('expenses').insert(newExp).select().single();
    if (error) throw error;
    return inserted;
  }

  const local = readLocalData();
  local.expenses.unshift(newExp);
  writeLocalData(local);
  return newExp;
}

export async function deleteExpense(userId: string, expenseId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId).eq('user_id', userId);
    return !error;
  }
  const local = readLocalData();
  local.expenses = local.expenses.filter((e) => !(e.id === expenseId && e.user_id === userId));
  writeLocalData(local);
  return true;
}

export async function addIncome(
  userId: string,
  data: { amount: number; source: string; date: string; wallet_id?: string | null }
): Promise<Income> {
  const newInc: Income = {
    id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId,
    amount: Number(data.amount),
    source: data.source,
    date: data.date,
    wallet_id: data.wallet_id || null,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data: inserted, error } = await supabase.from('income').insert(newInc).select().single();
    if (error) throw error;
    return inserted;
  }

  const local = readLocalData();
  local.income.unshift(newInc);
  writeLocalData(local);
  return newInc;
}

export async function deleteIncome(userId: string, incomeId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('income').delete().eq('id', incomeId).eq('user_id', userId);
    return !error;
  }
  const local = readLocalData();
  local.income = local.income.filter((i) => !(i.id === incomeId && i.user_id === userId));
  writeLocalData(local);
  return true;
}

export async function upsertBudget(userId: string, category: string, limit: number): Promise<Budget> {
  const budget: Budget = {
    id: `bud-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    user_id: userId,
    category,
    monthly_limit: Number(limit),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('budgets')
      .upsert({ user_id: userId, category, monthly_limit: Number(limit) }, { onConflict: 'user_id, category' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const local = readLocalData();
  const existingIdx = local.budgets.findIndex((b) => b.user_id === userId && b.category === category);
  if (existingIdx >= 0) {
    local.budgets[existingIdx].monthly_limit = Number(limit);
  } else {
    local.budgets.push(budget);
  }
  writeLocalData(local);
  return budget;
}

export async function deleteBudget(userId: string, category: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('budgets').delete().eq('user_id', userId).eq('category', category);
    return !error;
  }
  const local = readLocalData();
  local.budgets = local.budgets.filter((b) => !(b.user_id === userId && b.category === category));
  writeLocalData(local);
  return true;
}

export async function getFinancialSummary(userId: string, monthStr?: string): Promise<MonthlySummary> {
  const [expenses, income] = await Promise.all([getUserExpenses(userId), getUserIncome(userId)]);

  const targetMonth = monthStr || new Date().toISOString().substring(0, 7); // YYYY-MM

  const monthExpenses = expenses.filter((e) => e.date.startsWith(targetMonth));
  const monthIncome = income.filter((i) => i.date.startsWith(targetMonth));

  const totalExpense = monthExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalIncome = monthIncome.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  // Calculate daily allowance (Spendee feature)
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay + 1);
  const dailyAllowance = Math.max(0, balance / remainingDays);

  // Category breakdown
  const catMap = new Map<string, number>();
  for (const exp of monthExpenses) {
    catMap.set(exp.category, (catMap.get(exp.category) || 0) + Number(exp.amount));
  }

  const categories: CategoryBreakdown[] = Array.from(catMap.entries())
    .map(([cat, total]) => ({
      category: cat,
      total,
      percentage: totalExpense > 0 ? (total / totalExpense) * 100 : 0,
      color: getCategoryColor(cat),
    }))
    .sort((a, b) => b.total - a.total);

  return {
    month: targetMonth,
    income: totalIncome,
    expenses: totalExpense,
    balance,
    savingsRate,
    dailyAllowance,
    categories,
  };
}

export async function getBudgetStatuses(userId: string, monthStr?: string): Promise<BudgetStatus[]> {
  const targetMonth = monthStr || new Date().toISOString().substring(0, 7);
  const [budgets, expenses] = await Promise.all([getUserBudgets(userId), getUserExpenses(userId)]);

  const monthExpenses = expenses.filter((e) => e.date.startsWith(targetMonth));

  const spentMap = new Map<string, number>();
  for (const e of monthExpenses) {
    spentMap.set(e.category, (spentMap.get(e.category) || 0) + Number(e.amount));
  }

  return budgets.map((b) => {
    const spent = spentMap.get(b.category) || 0;
    const limit = Number(b.monthly_limit);
    const remaining = limit - spent;
    const percent = limit > 0 ? (spent / limit) * 100 : 0;
    return {
      category: b.category,
      limit,
      spent,
      remaining,
      percent,
      isExceeded: spent > limit,
      color: getCategoryColor(b.category),
    };
  });
}
