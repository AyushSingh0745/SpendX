export const EXPENSE_CATEGORIES = [
  { name: 'Food & Drinks', color: '#F59E0B', icon: 'Utensils' },
  { name: 'Shopping', color: '#EC4899', icon: 'ShoppingBag' },
  { name: 'Housing & Rent', color: '#6366F1', icon: 'Home' },
  { name: 'Transportation', color: '#06B6D4', icon: 'Car' },
  { name: 'Vehicle & Petrol', color: '#3B82F6', icon: 'Fuel' },
  { name: 'Entertainment', color: '#8B5CF6', icon: 'Film' },
  { name: 'Health & Medical', color: '#10B981', icon: 'HeartPulse' },
  { name: 'Bills & Utilities', color: '#14B8A6', icon: 'Zap' },
  { name: 'Education', color: '#F97316', icon: 'GraduationCap' },
  { name: 'Investments', color: '#84CC16', icon: 'TrendingUp' },
  { name: 'Other', color: '#64748B', icon: 'MoreHorizontal' },
] as const;

export const INCOME_SOURCES = [
  { name: 'Salary', color: '#16A34A', icon: 'Briefcase' },
  { name: 'Freelance & Gigs', color: '#059669', icon: 'Laptop' },
  { name: 'Business Income', color: '#0D9488', icon: 'Building' },
  { name: 'Investment Returns', color: '#2563EB', icon: 'PieChart' },
  { name: 'Family & Allowance', color: '#7C3AED', icon: 'Users' },
  { name: 'Gifts & Awards', color: '#DB2777', icon: 'Gift' },
  { name: 'Other', color: '#64748B', icon: 'MoreHorizontal' },
] as const;

export function getCategoryColor(categoryName: string): string {
  const cat = EXPENSE_CATEGORIES.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  if (cat) return cat.color;
  const inc = INCOME_SOURCES.find(s => s.name.toLowerCase() === categoryName.toLowerCase());
  if (inc) return inc.color;
  return '#64748B';
}

export function formatINR(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(num);
}
