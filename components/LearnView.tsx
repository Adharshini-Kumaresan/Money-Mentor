
import React from 'react';
import { LEARN_ARTICLES } from '../constants';

const LearnView: React.FC = () => {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Stuff No One Taught Us</h1>
        <p className="text-slate-500 text-sm mt-1">Quick reads that actually make sense</p>
      </div>

      <div className="space-y-6">
        {LEARN_ARTICLES.map((article, index) => (
          <div key={index} className="bg-white rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col gap-5 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                {React.cloneElement(article.icon as React.ReactElement, { size: 28 })}
              </div>
              <h3 className="font-bold text-slate-900 text-[17px] leading-snug">{article.title}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed px-1">
              {article.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnView;
