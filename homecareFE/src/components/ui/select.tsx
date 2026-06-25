import React from 'react';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ children, value, onValueChange }) => {
  const options: { value: string; label: string }[] = [];
  
  // Extract options from nested SelectItems
  const findOptions = (nodes: React.ReactNode) => {
    React.Children.forEach(nodes, (child) => {
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any>;
        if (element.props.value !== undefined && element.props.children) {
          options.push({
            value: element.props.value,
            label: element.props.children as string
          });
        } else if (element.props.children) {
          findOptions(element.props.children);
        }
      }
    });
  };

  findOptions(children);

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a282b] px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d8ca5] text-slate-800 dark:text-white cursor-pointer appearance-none"
      >
        <option value="" disabled className="bg-white dark:bg-[#1a282b] text-slate-400">Select a topic</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1a282b] text-slate-800 dark:text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export const SelectTrigger: React.FC<any> = ({ children }) => <>{children}</>;
export const SelectValue: React.FC<any> = ({ placeholder }) => <>{placeholder}</>;
export const SelectContent: React.FC<any> = ({ children }) => <>{children}</>;
export const SelectItem: React.FC<any> = ({ children, value }) => <option value={value}>{children}</option>;
export default Select;
