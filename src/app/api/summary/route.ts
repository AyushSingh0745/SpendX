import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getFinancialSummary, getUnifiedTransactions, getBudgetStatuses, getUserWallets } from '@/lib/financials';


export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month') || undefined;

  const [summary, transactions, budgets, wallets] = await Promise.all([
    getFinancialSummary(user.id, month),
    getUnifiedTransactions(user.id),
    getBudgetStatuses(user.id, month),
    getUserWallets(user.id),
  ]);

  return NextResponse.json({
    success: true,
    user,
    summary,
    transactions: transactions.slice(0, 15), // Recent 15
    budgets,
    wallets,
  });
}
