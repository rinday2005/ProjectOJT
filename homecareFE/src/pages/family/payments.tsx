import React from 'react';

export const Payments: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto font-manrope">
      <div className="bg-white dark:bg-stone-950 p-8 rounded-[2rem] border border-teal-50/50 dark:border-stone-800 shadow-md">
        <span className="material-symbols-outlined text-4xl text-[#0d8ca5] mb-4">payments</span>
        <h1 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Payments & Invoices</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm">Review transaction histories, billing statements, and active care invoices.</p>
      </div>
    </div>
  );
};
export default Payments;
