
import React from 'react';
import { Clock, Zap, Target, Sparkles } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils';

interface InsightsViewProps {
  expenses: Expense[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ expenses }) => {
  const getInsights = () => {
    if (expenses.length === 0) return [];
    
    const insights = [];

    // Milestone Insight (Immediate feedback for first log)
    if (expenses.length === 1) {
      insights.push({
        id: 'first-log',
        icon: <Sparkles className="text-amber-500" />,
        title: "First step taken!",
        content: "You've started your journey to awareness. Tracking is the hardest part — the discipline follows. Keep it up!"
      });
    }

    // Late Night Pattern
    const lateNightExpenses = expenses.filter(e => e.timeBlock === 'Late Night');
    const lateNightSum = lateNightExpenses.reduce((s, e) => s + e.amount, 0);
    if (lateNightSum > 0) {
      insights.push({
        id: 'late-night',
        icon: <Clock className="text-indigo-500" />,
        title: "Late-night decisions",
        content: `You've spent ${formatCurrency(lateNightSum)} during late nights. Willpower often dips after dark — notice if these were actual needs.`
      });
    }

    // UPI Over-reliance
    const upiSpends = expenses.filter(e => e.paymentMethod === 'UPI');
    if (upiSpends.length > 0) {
      const upiPercent = Math.round((upiSpends.length / expenses.length) * 100);
      insights.push({
        id: 'upi-painless',
        icon: <Zap className="text-violet-500" />,
        title: `${upiPercent}% UPI usage`,
        content: "Digital payments don't trigger the same 'loss' feeling as cash. It's easy for small UPI amounts to add up fast."
      });
    }

    // Need vs Want Balance
    const wants = expenses.filter(e => e.spendType === 'Want');
    if (wants.length > 0) {
      const wantPercent = Math.round((wants.length / expenses.length) * 100);
      if (wantPercent > 40) {
        insights.push({
          id: 'want-heavy',
          icon: <Target className="text-rose-500" />,
          title: "Wants vs Needs",
          content: `${wantPercent}% of your logs are 'wants'. Just pausing to ask 'do I need this?' is already a win for your discipline.`
        });
      }
    }

    return insights;
  };

  const activeInsights = getInsights();

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-32">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Insights</h1>
        <p className="text-slate-500 text-sm mt-1">Reflections, not commands.</p>
      </div>

      <div className="space-y-4">
        {activeInsights.length > 0 ? (
          activeInsights.map(insight => (
            <div key={insight.id} className="bg-white rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex gap-5 animate-in slide-in-from-bottom-2 duration-500">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                {React.cloneElement(insight.icon as React.ReactElement, { size: 28 })}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{insight.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{insight.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <Clock size={32} />
             </div>
             <p className="text-slate-400 font-bold max-w-[200px] mx-auto">Log your first expense to unlock daily insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsView;
