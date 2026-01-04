
import React, { useState, useEffect } from 'react';
import { Tab, Expense, UserState, TimeBlock, UserMode } from './types';
import { TABS } from './constants';
import TodayView from './components/TodayView';
import InsightsView from './components/InsightsView';
import LearnView from './components/LearnView';
import ProfileView from './components/ProfileView';
import AddSpendModal from './components/AddSpendModal';
import { getISODate, formatCurrency } from './utils';
import { Shield, Smartphone, PenTool, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Today');
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('moneymentor_user');
    return saved ? JSON.parse(saved) : {
      username: 'adharshini04',
      memberSince: 'Jan 2026',
      safeSpendLimit: 300,
      expenses: [],
      mode: undefined,
      isLoggedIn: false
    };
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('moneymentor_user', JSON.stringify(user));
  }, [user]);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
      date: getISODate(currentDate)
    };

    const updatedExpenses = [newExpense, ...user.expenses];
    setUser(prev => ({
      ...prev,
      expenses: updatedExpenses
    }));
    setIsModalOpen(false);

    // Handle Nudges for Instant Update Mode
    if (user.mode === 'Instant Update') {
      const dateStr = getISODate(currentDate);
      const dailyExpenses = updatedExpenses.filter(e => e.date === dateStr);
      const totalSpent = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);
      const safeLimit = user.safeSpendLimit;
      const leftAmount = safeLimit - totalSpent;

      let nudgeText = "";
      if (leftAmount < 100 && leftAmount >= 0) {
        nudgeText = `Only ${formatCurrency(leftAmount)} left today — just flagging it.`;
      } else if (totalSpent >= safeLimit * 0.8 && totalSpent < safeLimit) {
        nudgeText = `Heads up 👀 you’re getting close to today’s limit.`;
      } else {
        nudgeText = `${formatCurrency(Math.max(0, leftAmount))} left today. You’re good — plan easy.`;
      }
      setNudge(nudgeText);
      setTimeout(() => setNudge(null), 4000);
    }
  };

  const clearExpenses = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setUser(prev => ({ ...prev, expenses: [] }));
    }
  };

  const updateLimit = (newLimit: number) => {
    setUser(prev => ({ ...prev, safeSpendLimit: newLimit }));
  };

  const updateMode = (newMode: UserMode) => {
    setUser(prev => ({ ...prev, mode: newMode }));
  };

  const handleLogin = () => {
    setUser(prev => ({ ...prev, isLoggedIn: true }));
  };

  const handleModeSelection = (mode: UserMode) => {
    setUser(prev => ({ ...prev, mode }));
  };

  if (!user.isLoggedIn) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white p-8 justify-center items-center text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-violet-600 rounded-[28px] flex items-center justify-center text-white mb-8 shadow-xl shadow-violet-200">
          <Shield size={40} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">MoneyMentor</h1>
        <p className="text-slate-500 mb-12 leading-relaxed">Your personal money check-in experience. No shame, just awareness.</p>
        <button 
          onClick={handleLogin}
          className="w-full bg-violet-600 text-white font-bold py-5 rounded-[24px] shadow-lg shadow-violet-200 transition-all active:scale-[0.98]"
        >
          Continue to App
        </button>
      </div>
    );
  }

  if (!user.mode) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white p-8 animate-in slide-in-from-right duration-500">
        <h1 className="text-3xl font-black text-slate-900 mt-12 mb-2 tracking-tight">How do you want MoneyMentor to help you?</h1>
        <p className="text-slate-500 mb-12">Choose how you want to be guided. You can change this later in Profile.</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleModeSelection('Instant Update')}
            className="w-full text-left p-6 rounded-[32px] border-2 border-slate-50 bg-white hover:border-violet-200 hover:bg-violet-50/30 transition-all flex gap-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Smartphone size={28} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">Instant Update Mode</div>
              <p className="text-slate-500 text-sm leading-snug">I log my spends as they happen and want real-time awareness.</p>
            </div>
          </button>

          <button 
            onClick={() => handleModeSelection('Reflection')}
            className="w-full text-left p-6 rounded-[32px] border-2 border-slate-50 bg-white hover:border-violet-200 hover:bg-violet-50/30 transition-all flex gap-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <PenTool size={28} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">Reflection Mode</div>
              <p className="text-slate-500 text-sm leading-snug">I prefer logging at the end of the day and reflecting calmly.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'Today':
        return (
          <TodayView 
            user={user} 
            currentDate={currentDate} 
            setCurrentDate={setCurrentDate}
            onAddClick={(block) => {
              setSelectedTimeBlock(block);
              setIsModalOpen(true);
            }}
          />
        );
      case 'Insights':
        return <InsightsView expenses={user.expenses} />;
      case 'Learn':
        return <LearnView />;
      case 'Profile':
        return (
          <ProfileView 
            user={user} 
            onClearExpenses={clearExpenses}
            onUpdateLimit={updateLimit}
            onUpdateMode={updateMode}
          />
        );
      default:
        return <TodayView user={user} currentDate={currentDate} setCurrentDate={setCurrentDate} onAddClick={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white overflow-hidden relative border-x border-gray-100 shadow-xl">
      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        {renderView()}
      </main>

      {/* Instant Nudge Toast */}
      {nudge && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-[100] animate-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-900 text-white p-5 rounded-[24px] shadow-2xl flex items-center gap-4 border border-white/10">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <p className="font-bold text-sm leading-tight">{nudge}</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex items-center justify-around py-2 px-4 z-40">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 ${
              activeTab === tab.id ? 'bg-violet-50 text-violet-600' : 'text-gray-400'
            }`}
          >
            {tab.icon}
            <span className="text-[11px] mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Log Spend Modal */}
      {isModalOpen && (
        <AddSpendModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={addExpense}
          initialTimeBlock={selectedTimeBlock}
        />
      )}
    </div>
  );
};

export default App;
