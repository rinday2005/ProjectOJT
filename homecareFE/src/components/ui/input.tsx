import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d8ca5] disabled:cursor-not-allowed disabled:opacity-50 text-slate-800 dark:text-white ${className}`}
      {...props}
    />
  );
};

export default Input;
