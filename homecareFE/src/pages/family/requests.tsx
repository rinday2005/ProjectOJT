import React from 'react';

export const Requests: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto font-manrope">
      <div className="bg-white dark:bg-stone-950 p-8 rounded-[2rem] border border-teal-50/50 dark:border-stone-800 shadow-md">
        <span className="material-symbols-outlined text-4xl text-[#0d8ca5] mb-4">list_alt</span>
        <h1 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Service Requests</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm">Submit and monitor care requests sent to our operators here.</p>
      </div>
    </div>
  );
};
export default Requests;
