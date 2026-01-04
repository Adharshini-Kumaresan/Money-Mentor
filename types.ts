
export type TimeBlock = 'Morning' | 'Afternoon' | 'Evening' | 'Late Night';

export type UserMode = 'Instant Update' | 'Reflection';

export type Category = 
  | 'Food' 
  | 'Grocery' 
  | 'Travel' 
  | 'Education' 
  | 'Shopping' 
  | 'Entertainment' 
  | 'Subscriptions' 
  | 'Misc';

export type SpendType = 'Need' | 'Want';
export type PaymentMethod = 'UPI' | 'Cash';
export type SavingsMode = 'Daily' | 'Monthly' | 'None';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  spendType: SpendType;
  paymentMethod: PaymentMethod;
  timeBlock: TimeBlock;
  date: string; // ISO format (YYYY-MM-DD)
}

export interface UserState {
  username: string;
  memberSince: string;
  safeSpendLimit: number;
  expenses: Expense[];
  mode?: UserMode;
  isLoggedIn?: boolean;
  monthlyAllowance?: number;
  monthlySavingsGoal?: number;
  dailySavingsGoal?: number;
  savingsMode?: SavingsMode;
}

export type Tab = 'Today' | 'Insights' | 'Learn' | 'Profile';
