
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Category, SpendType, PaymentMethod, TimeBlock, Expense } from '../types';
import { CATEGORIES, TIME_BLOCKS } from '../constants';

interface AddSpendModalProps {
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id' | 'date'>) => void;
  initialTimeBlock: TimeBlock | null;
}

const AddSpendModal: React.FC<AddSpendModalProps> = ({ onClose, onSubmit, initialTimeBlock }) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<Category | null>(null);
  const [spendType, setSpendType] = useState<SpendType>('Need');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [timeBlock, setTimeBlock] = useState<TimeBlock>(initialTimeBlock || 'Morning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    onSubmit({
      amount: parseFloat(amount),
      category,
      spendType,
      paymentMethod,
      timeBlock
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl relative animate-in slide-in-from-bottom duration-500 ease-out flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-8">Log spend</h2>

        <form onSubmit={handleSubmit} className="space-y-8 pb-4">
          {/* Amount Input */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-slate-500 mb-2">Amount *</label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl font-medium">₹</span>
               <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-4 pl-10 pr-6 text-2xl font-bold text-slate-900 outline-none focus:border-violet-400 focus:bg-white transition-all appearance-none"
                required
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-4">Category *</label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                    category === cat.name 
                      ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className={category === cat.name ? 'text-white' : 'text-slate-400'}>{cat.icon}</span>
                  <span className="font-medium text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Need vs Want Toggle */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-4">Was this a need or a want? *</label>
            <div className="flex bg-slate-100 p-1.5 rounded-[24px]">
              {(['Need', 'Want'] as SpendType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSpendType(type)}
                  className={`flex-1 py-3 px-4 rounded-[20px] font-semibold text-sm transition-all duration-300 ${
                    spendType === type 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-4">Payment type</label>
            <div className="flex bg-slate-100 p-1.5 rounded-[24px]">
              {(['UPI', 'Cash'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-3 px-4 rounded-[20px] font-semibold text-sm transition-all duration-300 ${
                    paymentMethod === method 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Time Block (hidden but used internally, or selectable if user wants) */}
          <div className="hidden">
             <select value={timeBlock} onChange={(e) => setTimeBlock(e.target.value as TimeBlock)}>
                {TIME_BLOCKS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
             </select>
          </div>

          <button
            type="submit"
            disabled={!amount || !category}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-5 rounded-[24px] shadow-xl shadow-violet-200 transition-all active:scale-[0.98] mt-4"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSpendModal;
