import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, className = '' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0 cursor-pointer" 
        onClick={() => onOpenChange(false)} 
      />
      <div className={`relative w-full ${className || 'max-w-3xl'} bg-white dark:bg-[#1a282b] rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 animate-scale-up z-10`}>
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer z-50"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<any> = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<any> = ({ children }) => {
  return <div className="space-y-1.5 text-left">{children}</div>;
};

export const DialogTitle: React.FC<any> = ({ children, className = '' }) => {
  return <h2 className={`text-2xl font-black ${className}`}>{children}</h2>;
};

export const DialogDescription: React.FC<any> = ({ children, className = '' }) => {
  return <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>{children}</p>;
};

export default Dialog;
