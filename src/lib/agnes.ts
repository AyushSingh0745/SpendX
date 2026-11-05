import { getFinancialSummary, getBudgetStatuses } from './financials';
import { formatINR } from './constants';

const AGNES_API_KEY = process.env.AGNES_API_KEY || 'sk-Kx1BF7lEaXBkmO9HHAThklUoGBq3irp3EVBnghUXigkaFWBT';
const AGNES_BASE_URL = process.env.AGNES_BASE_URL || 'https://apihub.agnes-ai.com/v1';
const AGNES_MODEL = process.env.AGNES_MODEL || 'agnes-3.0-flash';

export interface ChatMessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function buildFinancialAdvisorContext(userId: string): Promise<string> {
  const [summary, budgets] = await Promise.all([
    getFinancialSummary(userId),
    getBudgetStatuses(userId),
  ]);

  const topCategories = summary.categories
    .slice(0, 4)
    .map((c) => `- ${c.category}: ${formatINR(c.total)} (${c.percentage.toFixed(1)}%)`)
    .join('\n');

  const budgetSummary = budgets
    .map((b) => `- ${b.category}: ${formatINR(b.spent)} / ${formatINR(b.limit)} (${b.percent.toFixed(0)}% used${b.isExceeded ? ' - EXCEEDED!' : ''})`)
    .join('\n');

  return `
CURRENT FINANCIAL SNAPSHOT FOR THIS USER (Month: ${summary.month}):
- Total Income: ${formatINR(summary.income)}
- Total Expenses: ${formatINR(summary.expenses)}
- Net Balance: ${formatINR(summary.balance)}
- Overall Savings Rate: ${summary.savingsRate.toFixed(1)}%
- Recommended Daily Allowance: ${formatINR(summary.dailyAllowance)}/day

TOP EXPENSE CATEGORIES:
${topCategories || 'None recorded yet.'}

ACTIVE BUDGETS:
${budgetSummary || 'No active budgets set.'}

AVAILABLE EXPENSE CATEGORIES:
Food & Drinks, Shopping, Housing & Rent, Transportation, Vehicle & Petrol, Entertainment, Health & Medical, Bills & Utilities, Education, Investments, Other.

AVAILABLE INCOME SOURCES:
Salary, Freelance & Gigs, Business Income, Investment Returns, Family & Allowance, Gifts & Awards, Other.
`.trim();
}

export function buildSystemPrompt(financialContext: string): string {
  return `
You are "SpendX AI" — an empathetic, sharp, and highly intelligent personal financial advisor embedded directly inside the SpendX app.
You communicate with a warm, encouraging Apple-like elegance and human rationale.

${financialContext}

YOUR MISSION:
1. Provide actionable, human-centered financial advice tailored directly to the numbers above.
2. If the user asks whether they can afford a purchase, calculate the exact impact on their remaining balance and daily budget allowance, offering realistic trade-offs.
3. CONVERSATIONAL TRANSACTION LOGGING (CRITICAL):
   If the user states or implies they spent money or received money (e.g. "I spent 450 on lunch", "Paid 200 for uber", "Got 5000 freelance payment", "Add expense 1200 for groceries"), you must identify the intent and emit an ACTION tag at the VERY END of your response in this exact format:
   <<<ACTION:{"type":"ADD_EXPENSE","amount":450,"category":"Food & Drinks","description":"lunch"}>>>
   or for income:
   <<<ACTION:{"type":"ADD_INCOME","amount":5000,"source":"Freelance & Gigs"}>>>

4. Keep responses crisp, visually structured with bullet points or bold text where appropriate, and always conclude with encouragement.
`.trim();
}

export async function callAgnesChat(messages: ChatMessageParam[], stream: boolean = false): Promise<Response> {
  const payload = {
    model: AGNES_MODEL,
    messages,
    stream,
    temperature: 0.7,
    max_tokens: 800,
  };

  return fetch(`${AGNES_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AGNES_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
}
