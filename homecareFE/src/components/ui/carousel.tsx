import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface CarouselContextType {
  activeIndex: number;
  totalSlides: number;
  registerSlide: () => number;
  deregisterSlide: () => void;
  scrollNext: () => void;
  scrollPrev: () => void;
}

const CarouselContext = createContext<CarouselContextType | null>(null);

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: { loop?: boolean };
  setApi?: (api: any) => void;
}

export const Carousel: React.FC<CarouselProps> = ({ children, opts, setApi, className, ...props }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const registerSlide = useCallback(() => {
    let index = 0;
    setSlideCount((prev) => {
      index = prev;
      return prev + 1;
    });
    return index;
  }, []);

  const deregisterSlide = useCallback(() => {
    setSlideCount((prev) => Math.max(0, prev - 1));
  }, []);

  const scrollNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (slideCount === 0) return 0;
      if (prev === slideCount - 1) {
        return opts?.loop !== false ? 0 : prev;
      }
      return prev + 1;
    });
  }, [slideCount, opts]);

  const scrollPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (slideCount === 0) return 0;
      if (prev === 0) {
        return opts?.loop !== false ? slideCount - 1 : prev;
      }
      return prev - 1;
    });
  }, [slideCount, opts]);

  // Use Refs to keep the latest function reference without triggering re-render loops
  const scrollNextRef = useRef(scrollNext);
  const scrollPrevRef = useRef(scrollPrev);

  useEffect(() => {
    scrollNextRef.current = scrollNext;
    scrollPrevRef.current = scrollPrev;
  }, [scrollNext, scrollPrev]);

  useEffect(() => {
    if (setApi) {
      setApi({
        scrollNext: () => scrollNextRef.current(),
        scrollPrev: () => scrollPrevRef.current()
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CarouselContext.Provider value={{ activeIndex, totalSlides: slideCount, registerSlide, deregisterSlide, scrollNext, scrollPrev }}>
      <div className={`relative overflow-hidden ${className}`} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

export const CarouselContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("CarouselContent must be used within Carousel");

  return (
    <div 
      className={`flex transition-transform duration-500 ease-in-out ${className}`} 
      style={{ transform: `translateX(-${context.activeIndex * 100}%)` }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CarouselItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("CarouselItem must be used within Carousel");

  const [slideIndex, setSlideIndex] = useState(-1);

  useEffect(() => {
    const idx = context.registerSlide();
    setSlideIndex(idx);
    return () => {
      context.deregisterSlide();
    };
  }, []);

  return (
    <div className={`w-full flex-shrink-0 min-w-full ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("CarouselPrevious must be used within Carousel");

  return (
    <button 
      ref={ref}
      onClick={context.scrollPrev}
      className={`rounded-full p-2 bg-black/40 text-white hover:bg-black/60 cursor-pointer flex items-center justify-center ${className}`}
      {...props}
    >
      {children || '←'}
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("CarouselNext must be used within Carousel");

  return (
    <button 
      ref={ref}
      onClick={context.scrollNext}
      className={`rounded-full p-2 bg-black/40 text-white hover:bg-black/60 cursor-pointer flex items-center justify-center ${className}`}
      {...props}
    >
      {children || '→'}
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";
