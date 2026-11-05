import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getUserIncome, addIncome, deleteIncome } from '@/lib/financials';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const income = await getUserIncome(user.id);
  return NextResponse.json({ success: true, income });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, source, date, wallet_id } = body;

    if (!amount || !source) {
      return NextResponse.json({ error: 'Amount and source are required' }, { status: 400 });
    }

    const inc = await addIncome(user.id, {
      amount: parseFloat(amount),
      source,
      date: date || new Date().toISOString().substring(0, 10),
      wallet_id,
    });

    return NextResponse.json({ success: true, income: inc });
  } catch (err: any) {
    console.error('Add income error:', err);
    return NextResponse.json({ error: err.message || 'Failed to add income' }, { status: 500 });
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
      return NextResponse.json({ error: 'Income ID required' }, { status: 400 });
    }

    await deleteIncome(user.id, id);
    return NextResponse.json({ success: true, message: 'Income deleted' });
  } catch (err: any) {
    console.error('Delete income error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete income' }, { status: 500 });
  }
}
