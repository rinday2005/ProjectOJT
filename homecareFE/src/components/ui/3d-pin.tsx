import React from 'react';

interface PinContainerProps {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
}

export const PinContainer: React.FC<PinContainerProps> = ({
  children,
  title,
  href,
  className
}) => {
  return (
    <div className={`relative flex items-center justify-center group/pin ${className}`}>
      {/* 3D perspective wrapper */}
      <div 
        className="relative flex items-center justify-center transition-all duration-500 ease-out [perspective:1000px] [transform-style:preserve-3d] group-hover/pin:[transform:rotateX(5deg)_translateY(-4px)]"
      >
        <div className="bg-white dark:bg-[#1a282b] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-white/5 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PinContainer;
