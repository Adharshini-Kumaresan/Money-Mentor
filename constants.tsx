
import React from 'react';
import { 
  Type, 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  Coffee, 
  ShoppingCart, 
  Bus, 
  BookOpen, 
  ShoppingBag, 
  Tv, 
  CreditCard, 
  MoreHorizontal,
  Home,
  TrendingUp,
  Bookmark,
  User,
  Scale,
  Zap,
  Target,
  BarChart2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { TimeBlock, Category } from './types';

export const TIME_BLOCKS: { name: TimeBlock; icon: React.ReactNode; color: string }[] = [
  { name: 'Morning', icon: <Sunrise size={20} />, color: 'bg-orange-500' },
  { name: 'Afternoon', icon: <Sun size={20} />, color: 'bg-yellow-400' },
  { name: 'Evening', icon: <Sunset size={20} />, color: 'bg-rose-500' },
  { name: 'Late Night', icon: <Moon size={20} />, color: 'bg-indigo-600' },
];

export const CATEGORIES: { name: Category; icon: React.ReactNode }[] = [
  { name: 'Food', icon: <Coffee size={18} /> },
  { name: 'Grocery', icon: <ShoppingCart size={18} /> },
  { name: 'Travel', icon: <Bus size={18} /> },
  { name: 'Education', icon: <BookOpen size={18} /> },
  { name: 'Shopping', icon: <ShoppingBag size={18} /> },
  { name: 'Entertainment', icon: <Tv size={18} /> },
  { name: 'Subscriptions', icon: <CreditCard size={18} /> },
  { name: 'Misc', icon: <MoreHorizontal size={18} /> },
];

export const TABS = [
  { id: 'Today' as const, label: 'Today', icon: <Home size={24} /> },
  { id: 'Insights' as const, label: 'Insights', icon: <TrendingUp size={24} /> },
  { id: 'Learn' as const, label: 'Learn', icon: <Bookmark size={24} /> },
  { id: 'Profile' as const, label: 'Profile', icon: <User size={24} /> },
];

export const LEARN_ARTICLES = [
  {
    title: "Need vs Want: The Real Difference",
    icon: <Scale className="text-blue-500" />,
    content: "A need is something you can't function without — food, transport to class, textbooks. A want is everything else — late-night snacks, that third coffee, new earphones when yours still work. The line gets blurry, but asking the question itself is the win."
  },
  {
    title: "Why UPI Makes You Overspend",
    icon: <Zap className="text-purple-500" />,
    content: "UPI feels painless. That's exactly why we overspend with it. Digital payments don't trigger the same 'loss' feeling as handing over cash. Your brain literally notices when physical money leaves your hand — UPI skips that entire signal."
  },
  {
    title: "How To Save Without Feeling Broke",
    icon: <Target className="text-green-500" />,
    content: "Don't cut everything. Just pause before wants. Ask: do I need this right now, or can it wait? Small delays add up. Saving isn't about restriction — it's about choice. You're in control, not your impulses."
  },
  {
    title: "Why Small Spends Matter More Than Big Ones",
    icon: <BarChart2 className="text-emerald-500" />,
    content: "₹50 on coffee every day = ₹1,500 a month. You don't notice it because each spend feels tiny. Big purchases hurt, so we're careful. Small ones slip by unnoticed — that's where the real money goes. Track the small stuff."
  },
  {
    title: "Late-Night Decisions Are Expensive",
    icon: <Clock className="text-indigo-500" />,
    content: "Your willpower is a muscle that gets tired. By night, you've used it all day — so saying no to food apps or impulse buys becomes way harder. It's not lack of discipline, it's biology. Plan ahead or just notice the pattern."
  },
  {
    title: "You Are Training Awareness, Not Restriction",
    icon: <ShieldCheck className="text-blue-600" />,
    content: "MoneyMentor never stops you from spending. We're not here to parent you. The goal is simple: think once before you spend. That one moment of awareness? It's everything. The rest is your call."
  }
];
