import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getUnifiedTransactions } from '@/lib/financials';


export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const transactions = await getUnifiedTransactions(user.id);

  let csv = 'ID,Type,Category,Amount (INR),Description,Date\n';
  for (const t of transactions) {
    const escapedDesc = `"${(t.description || '').replace(/"/g, '""')}"`;
    csv += `${t.id},${t.type},${t.category},${t.amount.toFixed(2)},${escapedDesc},${t.date}\n`;
  }

  const filename = `spendx_export_${new Date().toISOString().substring(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
