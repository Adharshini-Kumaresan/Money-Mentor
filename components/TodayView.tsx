
import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Lightbulb, ClipboardCheck, PiggyBank } from 'lucide-react';
import { UserState, TimeBlock } from '../types';
import { TIME_BLOCKS } from '../constants';
import { formatCurrency, getISODate, getDisplayDate, getDisplayDayName } from '../utils';

interface TodayViewProps {
  user: UserState;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onAddClick: (block: TimeBlock) => void;
}

const TodayView: React.FC<TodayViewProps> = ({ user, currentDate, setCurrentDate, onAddClick }) => {
  const dateStr = getISODate(currentDate);
  const todayStr = getISODate(new Date());
  const isToday = dateStr === todayStr;
  const isFuture = dateStr > todayStr;

  const dailyExpenses = user.expenses.filter(e => e.date === dateStr);
  const totalSpent = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const safeLimit = user.safeSpendLimit;
  const leftAmount = safeLimit - totalSpent;
  const progress = Math.min((totalSpent / safeLimit) * 100, 100);

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const jumpToToday = () => setCurrentDate(new Date());

  const getInsight = () => {
    if (dailyExpenses.length === 0) return null;
    const wants = dailyExpenses.filter(e => e.spendType === 'Want');
    const upiSpends = dailyExpenses.filter(e => e.paymentMethod === 'UPI');
    
    if (wants.length > 2) {
      return {
        title: "A few extra 'wants' today.",
        description: "Late-night food or small treats? Worth a quick rethink for tomorrow?"
      };
    }
    if (upiSpends.length > dailyExpenses.length * 0.7) {
      return {
        title: "UPI is feeling easy today.",
        description: "Digital spends slip away fast. Maybe try tracking your next one before you pay?"
      };
    }
    return {
      title: "Solid awareness today.",
      description: "You're tracking your spends in real-time. That's the real win."
    };
  };

  const getReflectionSummary = () => {
    if (dailyExpenses.length === 0 || user.mode !== 'Reflection') return null;
    
    let status = "Today ended close to your budget.";
    if (totalSpent > safeLimit) status = "Today exceeded your safe spend zone.";
    else if (totalSpent < safeLimit * 0.5) status = "Today was a very light spend day.";

    const wantsCount = dailyExpenses.filter(e => e.spendType === 'Want').length;
    let insight = "Most spending was balanced.";
    if (wantsCount > dailyExpenses.length * 0.5) insight = "Wants made up a big part of today’s spends.";

    const blockSums = TIME_BLOCKS.map(tb => ({
      name: tb.name,
      sum: dailyExpenses.filter(e => e.timeBlock === tb.name).reduce((s, e) => s + e.amount, 0)
    }));
    const heaviest = blockSums.reduce((prev, current) => (prev.sum > current.sum) ? prev : current);
    let suggestion = `Tomorrow could be a little lighter — your call.`;

    return {
      status,
      detail: `Most spending happened in the ${heaviest.name.toLowerCase()}.`,
      insight,
      suggestion
    };
  };

  const insight = getInsight();
  const reflection = getReflectionSummary();

  const isDailySavingActive = user.savingsMode === 'Daily' && user.dailySavingsGoal && user.dailySavingsGoal > 0;

  return (
    <div className="p-5 flex flex-col space-y-6 pb-28 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">MoneyMentor</h1>
        <p className="text-slate-500 text-sm">Train discipline, not control.</p>
      </div>

      {/* Date Switcher */}
      <div className="bg-white rounded-[28px] p-2 flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
        <div className="flex items-center justify-between w-full p-1">
          <button onClick={() => changeDate(-1)} className="p-3 hover:bg-slate-50 rounded-full transition-colors active:scale-90">
            <ChevronLeft size={20} className="text-slate-400" />
          </button>
          <div className="text-center">
            <div className="font-bold text-slate-800 text-base">{getDisplayDate(currentDate)}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{getDisplayDayName(currentDate)}</div>
          </div>
          <button onClick={() => changeDate(1)} className="p-3 hover:bg-slate-50 rounded-full transition-colors active:scale-90">
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        </div>
        {!isToday && (
          <button 
            onClick={jumpToToday}
            className="w-full mt-1 mb-1 py-2 text-violet-600 font-bold text-xs uppercase tracking-wider hover:text-violet-700"
          >
            Back to Today
          </button>
        )}
      </div>

      {isFuture ? (
        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-10 text-center space-y-3">
          <div className="text-slate-400 font-medium">This day hasn't arrived yet ☁️</div>
          <p className="text-slate-400 text-sm leading-relaxed px-4">
            You'll be able to log your daily planner once the clock strikes midnight.
          </p>
        </div>
      ) : (
        <>
          {/* Safe Spend Progress */}
          <div className="bg-white rounded-[32px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col gap-5">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Safe spend zone</div>
                <div className="text-emerald-500 text-2xl font-black">{formatCurrency(safeLimit)}</div>
              </div>
              <div className="text-right space-y-0.5">
                <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Spent</div>
                <div className="text-slate-900 text-2xl font-black">{formatCurrency(totalSpent)}</div>
              </div>
            </div>

            <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-700 rounded-full ${leftAmount < 0 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                style={{ width: `${progress}%` }}
              />
              {isDailySavingActive && (
                <div 
                  className="absolute top-0 h-full border-l-2 border-dashed border-emerald-600/30"
                  style={{ left: `${Math.max(0, 100 - (user.dailySavingsGoal! / safeLimit) * 100)}%` }}
                />
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide">
              <span className="text-slate-500">
                {leftAmount >= 0 ? (
                  <span>{formatCurrency(leftAmount)} remaining</span>
                ) : (
                  <span className="text-amber-600">{formatCurrency(Math.abs(leftAmount))} over safe zone</span>
                )}
              </span>
              {isDailySavingActive && (
                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <PiggyBank size={10} />
                  {formatCurrency(user.dailySavingsGoal!)} saving goal
                </span>
              )}
            </div>
          </div>

          {/* Reflection Summary Card */}
          {reflection && (
            <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <ClipboardCheck size={20} className="text-white" />
                </div>
                <h3 className="font-bold">Daily Reflection Summary</h3>
              </div>
              <div className="space-y-2">
                <p className="text-white font-bold text-lg leading-tight">{reflection.status}</p>
                <div className="space-y-1 text-white/70 text-sm font-medium">
                  <p>• {reflection.detail}</p>
                  <p>• {reflection.insight}</p>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-emerald-400 font-bold text-sm">{reflection.suggestion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Insight Card */}
          {insight && user.mode === 'Instant Update' && (
            <div className="bg-blue-50/60 border border-blue-100/50 rounded-[32px] p-5 flex gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Lightbulb size={24} className="text-blue-500" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-blue-900 font-bold text-[15px] mb-0.5">{insight.title}</div>
                <div className="text-blue-600/80 text-sm leading-snug">{insight.description}</div>
              </div>
            </div>
          )}

          {/* Time Blocks */}
          <div className="grid grid-cols-1 gap-4">
            {TIME_BLOCKS.map(block => {
              const blockExpenses = dailyExpenses.filter(e => e.timeBlock === block.name);
              const blockTotal = blockExpenses.reduce((sum, e) => sum + e.amount, 0);
              
              return (
                <div key={block.name} className="bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 transition-all active:scale-[0.99]">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${block.color} text-white flex items-center justify-center shadow-inner`}>
                        {block.icon}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-[15px]">{block.name}</div>
                        <div className="text-slate-400 text-xs font-medium">
                          {blockExpenses.length > 0 ? `${blockExpenses.length} spend${blockExpenses.length > 1 ? 's' : ''}` : 'Nothing logged'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {blockTotal > 0 && <span className="font-bold text-slate-900 text-sm">{formatCurrency(blockTotal)}</span>}
                      <button 
                        onClick={() => onAddClick(block.name)}
                        className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 transition-all active:scale-90"
                      >
                        <Plus size={20} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                  
                  {blockExpenses.length > 0 && (
                    <div className="border-t border-slate-50 px-5 pb-5 pt-3 space-y-3">
                      {blockExpenses.map(exp => (
                        <div key={exp.id} className="flex items-center justify-between group">
                          <div className="flex flex-col">
                            <span className="text-slate-700 text-sm font-bold">{exp.category}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${exp.spendType === 'Need' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                                {exp.spendType}
                              </span>
                              <span className="text-[9px] text-slate-300 font-bold uppercase">{exp.paymentMethod}</span>
                            </div>
                          </div>
                          <span className="text-slate-900 text-sm font-black">{formatCurrency(exp.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50/50 rounded-[32px] p-8 text-center border border-slate-100">
            {leftAmount > 0 ? (
              <div className="space-y-1">
                <div className="text-emerald-500 font-black text-sm uppercase tracking-widest">Low-key win 🌿</div>
                <p className="text-slate-500 text-sm">
                  You didn't spend {formatCurrency(leftAmount)} today — that's discipline in action.
                </p>
              </div>
            ) : (
              <div className="text-slate-400 text-sm font-medium">
                No invisible savings today. Tomorrow is a fresh start.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TodayView;
