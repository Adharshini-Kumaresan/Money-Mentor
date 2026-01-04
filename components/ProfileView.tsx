
import React, { useState } from 'react';
import { User, Wallet, TrendingUp, LogOut, Trash2, Smartphone, PenTool } from 'lucide-react';
import { UserState, UserMode } from '../types';
import { formatCurrency } from '../utils';

interface ProfileViewProps {
  user: UserState;
  onClearExpenses: () => void;
  onUpdateLimit: (limit: number) => void;
  onUpdateMode: (mode: UserMode) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onClearExpenses, onUpdateLimit, onUpdateMode }) => {
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [newLimit, setNewLimit] = useState(user.safeSpendLimit.toString());

  const totalSpentAllTime = user.expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const calculateInvisibleSavings = () => {
    const expensesByDay: Record<string, number> = {};
    user.expenses.forEach(e => {
      expensesByDay[e.date] = (expensesByDay[e.date] || 0) + e.amount;
    });

    let totalSavings = 0;
    Object.values(expensesByDay).forEach(spent => {
      if (spent < user.safeSpendLimit) {
        totalSavings += (user.safeSpendLimit - spent);
      }
    });
    return totalSavings;
  };

  const handleSaveLimit = () => {
    onUpdateLimit(parseInt(newLimit) || 0);
    setIsEditingLimit(false);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your settings and stats</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-50 flex items-center gap-5">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user.username}</h2>
          <p className="text-slate-400 text-sm">Member since {user.memberSince}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-gray-50 space-y-4">
          <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
            <Wallet size={20} />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total spent</div>
            <div className="text-slate-900 text-xl font-bold">{formatCurrency(totalSpentAllTime)}</div>
          </div>
        </div>
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-gray-50 space-y-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Invisible savings</div>
            <div className="text-slate-900 text-xl font-bold">{formatCurrency(calculateInvisibleSavings())}</div>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-50 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Daily safe spend</h3>
            <button 
              onClick={() => setIsEditingLimit(!isEditingLimit)}
              className="text-violet-600 font-bold text-sm"
            >
              {isEditingLimit ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {isEditingLimit ? (
            <div className="flex gap-3 animate-in slide-in-from-top-2 duration-300">
               <input
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 outline-none focus:border-violet-300"
              />
              <button 
                onClick={handleSaveLimit}
                className="bg-violet-600 text-white px-6 py-2 rounded-2xl font-bold"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(user.safeSpendLimit)}</div>
              <p className="text-slate-400 text-sm leading-relaxed">
                This is your daily safe spend zone — it's a guide, not a limit
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-4">App Mode</h3>
          <div className="flex bg-slate-100 p-1.5 rounded-[24px]">
            <button
              onClick={() => onUpdateMode('Instant Update')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[20px] font-bold text-sm transition-all ${
                user.mode === 'Instant Update' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Smartphone size={16} />
              Instant
            </button>
            <button
              onClick={() => onUpdateMode('Reflection')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[20px] font-bold text-sm transition-all ${
                user.mode === 'Reflection' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              <PenTool size={16} />
              Reflection
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-3 px-2">
            {user.mode === 'Instant Update' 
              ? 'You receive real-time nudges after logging.' 
              : 'You receive a calm summary at the end of the day.'}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">Invisible savings explained</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Every day you spend less than your safe spend zone, the difference gets added here. It's not real money in your account — it's a celebration of your discipline across all your tracked days.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 pb-4">
        <button 
          onClick={onClearExpenses}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-orange-200 rounded-[24px] text-orange-600 font-bold bg-orange-50/30 hover:bg-orange-50 transition-colors"
        >
          <Trash2 size={20} />
          Clear all expenses
        </button>
        <button 
          className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-slate-100 rounded-[24px] text-slate-600 font-bold bg-slate-50/50 hover:bg-slate-100 transition-colors"
        >
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
