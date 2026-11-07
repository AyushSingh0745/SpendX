import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { buildFinancialAdvisorContext, buildSystemPrompt, callAgnesChat, ChatMessageParam } from '@/lib/agnes';
import { addExpense, addIncome, upsertBudget } from '@/lib/financials';

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messages, stream = false } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Build real-time financial snapshot
    const context = await buildFinancialAdvisorContext(user.id);
    const systemPrompt = buildSystemPrompt(context);

    const fullMessages: ChatMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-8), // Send last 8 conversation turns for fast, contextual responses
    ];

    const response = await callAgnesChat(fullMessages, false);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Agnes API error:', response.status, errText);
      return NextResponse.json({
        role: 'assistant',
        content: `I'm having a slight connection blip with the advisor engine. Here is a quick snapshot: ${context}`,
      });
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || 'I could not generate an answer right now.';

    // Check for Action Execution Tag
    let actionExecuted: any = null;
    const actionMatch = reply.match(/<<<ACTION:(.*?)>>>/);

    if (actionMatch && actionMatch[1]) {
      try {
        const actionData = JSON.parse(actionMatch[1].trim());

        if (actionData.type === 'ADD_EXPENSE') {
          const exp = await addExpense(user.id, {
            amount: Number(actionData.amount),
            category: actionData.category || 'Other',
            description: actionData.description || 'Logged via SpendX AI',
            date: actionData.date || new Date().toISOString().substring(0, 10),
          });
          actionExecuted = {
            type: 'ADD_EXPENSE',
            details: exp,
            message: `Recorded expense of ₹${exp.amount} under ${exp.category}`,
          };
        } else if (actionData.type === 'ADD_INCOME') {
          const inc = await addIncome(user.id, {
            amount: Number(actionData.amount),
            source: actionData.source || 'Other',
            date: actionData.date || new Date().toISOString().substring(0, 10),
          });
          actionExecuted = {
            type: 'ADD_INCOME',
            details: inc,
            message: `Recorded income of ₹${inc.amount} from ${inc.source}`,
          };
        } else if (actionData.type === 'SET_BUDGET') {
          const bud = await upsertBudget(user.id, actionData.category, Number(actionData.amount));
          actionExecuted = {
            type: 'SET_BUDGET',
            details: bud,
            message: `Set budget of ₹${bud.monthly_limit} for ${bud.category}`,
          };
        }

        // Clean out action tag from user-facing text
        reply = reply.replace(/<<<ACTION:.*?>>>/g, '').trim();
      } catch (parseErr) {
        console.error('Failed to parse AI action:', parseErr);
      }
    }

    return NextResponse.json({
      role: 'assistant',
      content: reply,
      action: actionExecuted,
    });
  } catch (err: any) {
    console.error('AI chat error:', err);
    return NextResponse.json({ error: err.message || 'AI chat request failed' }, { status: 500 });
  }
}
