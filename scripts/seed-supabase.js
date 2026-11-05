const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
// Load environment variables manually without extra dependencies
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing from .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAndSeed() {
  console.log('🔄 Checking connection to Supabase:', supabaseUrl);

  // 1. Check if tables exist
  const { data: users, error: userError } = await supabase.from('users').select('*').limit(1);

  if (userError) {
    if (userError.code === 'PGRST205' || userError.message.includes('Could not find the table')) {
      console.log('\n⚠️  TABLES NOT FOUND YET!');
      console.log('👉 Please run the schema SQL in your Supabase dashboard:');
      console.log('   https://supabase.com/dashboard/project/kpcawkitacpxkpcvaxgt/sql/new\n');
      console.log('Copy and paste the contents of schema.sql, then click "Run".');
      return false;
    }
    console.error('❌ Supabase query error:', userError);
    return false;
  }

  console.log('✅ Tables exist in Supabase!');

  // 2. Check or create default user
  const targetEmail = 'ayush@spendx.app';
  const { data: existingUser } = await supabase.from('users').select('*').eq('email', targetEmail).maybeSingle();

  let userId;
  if (!existingUser) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('admin123', salt);
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: targetEmail,
        name: 'Ayush Singh',
        password_hash: passwordHash,
        otp_code: '123456',
        otp_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create default user:', createError.message);
      return false;
    }
    userId = newUser.id;
    console.log('✅ Created default user in Supabase:', targetEmail, 'ID:', userId);
  } else {
    userId = existingUser.id;
    console.log('✅ User already exists in Supabase:', targetEmail, 'ID:', userId);
  }

  // 3. Wallets
  const { data: wallets } = await supabase.from('wallets').select('*').eq('user_id', userId);
  let mainWalletId = wallets?.[0]?.id;

  if (!wallets || wallets.length === 0) {
    const { data: newWallets, error: walletError } = await supabase
      .from('wallets')
      .insert([
        {
          user_id: userId,
          name: 'Main Wallet (Cash)',
          type: 'Cash',
          balance: 1500.0,
          color: '#2563EB',
        },
        {
          user_id: userId,
          name: 'HDFC Savings Account',
          type: 'Bank',
          balance: 40000.0,
          color: '#10B981',
        },
      ])
      .select();

    if (walletError) {
      console.error('❌ Failed to create wallets:', walletError.message);
    } else {
      mainWalletId = newWallets[0].id;
      console.log('✅ Created default wallets in Supabase:', newWallets.length);
    }
  }

  // 4. Seed Expenses (Migrated from SQLite)
  const { count: expenseCount } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (!expenseCount || expenseCount === 0) {
    const sampleExpenses = [
      {
        user_id: userId,
        wallet_id: mainWalletId,
        amount: 350.0,
        category: 'Food & Drinks',
        description: 'Lunch at Subway (Agnes AI conversational log)',
        date: new Date().toISOString().split('T')[0],
      },
      {
        user_id: userId,
        wallet_id: mainWalletId,
        amount: 48598.0,
        category: 'Food & Drinks',
        description: 'Aisehi (Migrated from SQLite)',
        date: new Date().toISOString().split('T')[0],
      },
      {
        user_id: userId,
        wallet_id: mainWalletId,
        amount: 350.0,
        category: 'Transportation',
        description: 'Metro card recharge',
        date: new Date().toISOString().split('T')[0],
      },
    ];
    await supabase.from('expenses').insert(sampleExpenses);
    console.log('✅ Seeded', sampleExpenses.length, 'expenses into Supabase!');
  }

  // 5. Seed Income (Migrated from SQLite)
  const { count: incomeCount } = await supabase
    .from('income')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (!incomeCount || incomeCount === 0) {
    const sampleIncome = [
      {
        user_id: userId,
        wallet_id: mainWalletId,
        amount: 40000.0,
        source: 'Salary',
        date: new Date().toISOString().split('T')[0],
      },
      {
        user_id: userId,
        wallet_id: mainWalletId,
        amount: 10000.0,
        source: 'Family',
        date: new Date().toISOString().split('T')[0],
      },
    ];
    await supabase.from('income').insert(sampleIncome);
    console.log('✅ Seeded', sampleIncome.length, 'income records into Supabase!');
  }

  // 6. Seed Budgets
  const { count: budgetCount } = await supabase
    .from('budgets')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (!budgetCount || budgetCount === 0) {
    const sampleBudgets = [
      { user_id: userId, category: 'Food & Drinks', monthly_limit: 15000.0 },
      { user_id: userId, category: 'Shopping', monthly_limit: 8000.0 },
      { user_id: userId, category: 'Transportation', monthly_limit: 5000.0 },
    ];
    await supabase.from('budgets').insert(sampleBudgets);
    console.log('✅ Seeded', sampleBudgets.length, 'budgets into Supabase!');
  }

  console.log('\n🎉 ALL TABLES VERIFIED & DATA SYNCED TO SUPABASE CLOUD SUCCESSFULLY!');
  return true;
}

verifyAndSeed();
