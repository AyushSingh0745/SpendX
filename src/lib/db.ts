import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { User, Wallet, Expense, Income, Budget, ChatMessage } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseUrl.startsWith('https://') && supabaseServiceKey && supabaseServiceKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

// Local persistent JSON storage fallback
const DATA_FILE = path.join(process.cwd(), 'spendx_data.json');

interface LocalDatabase {
  users: User[];
  wallets: Wallet[];
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  chat_messages: ChatMessage[];
}

function getInitialLocalData(): LocalDatabase {
  const defaultUserId = 'user-ayush-001';
  return {
    users: [
      {
        id: defaultUserId,
        email: 'ayush@spendx.app',
        name: 'Ayush Singh',
        created_at: new Date().toISOString(),
      },
    ],
    wallets: [
      {
        id: 'wallet-main',
        user_id: defaultUserId,
        name: 'Main Wallet (Cash)',
        type: 'Cash',
        balance: 1500.0,
        color: '#2563EB',
        created_at: new Date().toISOString(),
      },
      {
        id: 'wallet-bank',
        user_id: defaultUserId,
        name: 'HDFC Savings Account',
        type: 'Bank',
        balance: 40000.0,
        color: '#10B981',
        created_at: new Date().toISOString(),
      },
    ],
    expenses: [
      {
        id: 'exp-1',
        user_id: defaultUserId,
        wallet_id: 'wallet-main',
        amount: 500.0,
        category: 'Food & Drinks',
        description: 'GH (Migrated from SQLite)',
        date: '2026-09-13',
        created_at: '2026-09-13T10:00:00Z',
      },
      {
        id: 'exp-2',
        user_id: defaultUserId,
        wallet_id: 'wallet-main',
        amount: 300.0,
        category: 'Transportation',
        description: 'Travel (Migrated from SQLite)',
        date: '2026-09-20',
        created_at: '2026-09-20T11:00:00Z',
      },
      {
        id: 'exp-3',
        user_id: defaultUserId,
        wallet_id: 'wallet-bank',
        amount: 48598.0,
        category: 'Food & Drinks',
        description: 'Aisehi (Migrated from SQLite)',
        date: '2026-11-01',
        created_at: '2026-11-01T14:30:00Z',
      },
    ],
    income: [
      {
        id: 'inc-1',
        user_id: defaultUserId,
        wallet_id: 'wallet-main',
        amount: 10000.0,
        source: 'Family & Allowance',
        date: '2026-09-13',
        created_at: '2026-09-13T09:00:00Z',
      },
      {
        id: 'inc-2',
        user_id: defaultUserId,
        wallet_id: 'wallet-bank',
        amount: 40000.0,
        source: 'Salary',
        date: '2026-11-01',
        created_at: '2026-11-01T08:00:00Z',
      },
    ],
    budgets: [
      {
        id: 'bud-1',
        user_id: defaultUserId,
        category: 'Food & Drinks',
        monthly_limit: 15000.0,
        created_at: new Date().toISOString(),
      },
      {
        id: 'bud-2',
        user_id: defaultUserId,
        category: 'Transportation',
        monthly_limit: 5000.0,
        created_at: new Date().toISOString(),
      },
      {
        id: 'bud-3',
        user_id: defaultUserId,
        category: 'Shopping',
        monthly_limit: 8000.0,
        created_at: new Date().toISOString(),
      },
    ],
    chat_messages: [
      {
        id: 'chat-welcome',
        user_id: defaultUserId,
        role: 'assistant',
        content:
          'Hello Ayush! 👋 I am your SpendX AI Financial Advisor powered by Agnes 3.0 Flash. I have full access to your income, expenses, and budgets. Ask me for financial advice or tell me what you spent (e.g., "I spent ₹350 on pizza") and I will record it for you!',
        action_taken: null,
        created_at: new Date().toISOString(),
      },
    ],
  };
}

export function readLocalData(): LocalDatabase {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialLocalData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local data file, resetting to initial:', err);
    const initial = getInitialLocalData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

export function writeLocalData(data: LocalDatabase): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local data file:', err);
  }
}
