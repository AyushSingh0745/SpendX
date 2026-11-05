import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getUserBudgets, upsertBudget, deleteBudget, getBudgetStatuses } from '@/lib/financials';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [budgets, statuses] = await Promise.all([
    getUserBudgets(user.id),
    getBudgetStatuses(user.id),
  ]);

  return NextResponse.json({ success: true, budgets, statuses });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { category, monthly_limit } = await req.json();

    if (!category || !monthly_limit) {
      return NextResponse.json({ error: 'Category and monthly_limit are required' }, { status: 400 });
    }

    const budget = await upsertBudget(user.id, category, parseFloat(monthly_limit));
    return NextResponse.json({ success: true, budget });
  } catch (err: any) {
    console.error('Save budget error:', err);
    return NextResponse.json({ error: err.message || 'Failed to save budget' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ error: 'Category required' }, { status: 400 });
    }

    await deleteBudget(user.id, category);
    return NextResponse.json({ success: true, message: 'Budget removed' });
  } catch (err: any) {
    console.error('Delete budget error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete budget' }, { status: 500 });
  }
}
