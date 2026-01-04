
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
}

export type Tab = 'Today' | 'Insights' | 'Learn' | 'Profile';
