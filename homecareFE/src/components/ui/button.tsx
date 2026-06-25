import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  asChild = false,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variantStyles = {
    default: 'bg-[#0d8ca5] text-white hover:bg-[#0d8ca5]/90 shadow-sm',
    outline: 'border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 bg-transparent',
    ghost: 'text-slate-600 hover:text-[#0d8ca5] hover:bg-slate-50 dark:hover:bg-white/5 bg-transparent'
  };

  const sizeStyles = {
    sm: 'h-9 px-4 rounded-xl text-sm',
    md: 'h-11 px-6 rounded-2xl text-base',
    lg: 'h-14 px-8 rounded-full text-lg',
    icon: 'h-9 w-9 rounded-xl'
  };

  const combinedClass = cn(baseStyle, variantStyles[variant], sizeStyles[size], className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(combinedClass, (children.props as any).className),
      ...props
    });
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
