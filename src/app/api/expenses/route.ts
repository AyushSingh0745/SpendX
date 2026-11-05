import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getUserExpenses, addExpense, deleteExpense } from '@/lib/financials';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const expenses = await getUserExpenses(user.id);
  return NextResponse.json({ success: true, expenses });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, category, description, date, wallet_id } = body;

    if (!amount || !category) {
      return NextResponse.json({ error: 'Amount and category are required' }, { status: 400 });
    }

    const exp = await addExpense(user.id, {
      amount: parseFloat(amount),
      category,
      description,
      date: date || new Date().toISOString().substring(0, 10),
      wallet_id,
    });

    return NextResponse.json({ success: true, expense: exp });
  } catch (err: any) {
    console.error('Add expense error:', err);
    return NextResponse.json({ error: err.message || 'Failed to add expense' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Expense ID required' }, { status: 400 });
    }

    await deleteExpense(user.id, id);
    return NextResponse.json({ success: true, message: 'Expense deleted' });
  } catch (err: any) {
    console.error('Delete expense error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete expense' }, { status: 500 });
  }
}
