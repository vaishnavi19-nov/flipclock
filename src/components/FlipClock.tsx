import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FlipUnitProps {
  value: string;
  title?: string;
  indicator?: string;
}

const AnimatedCard = ({ value, isTop, className = "h-1/2" }: { value: string, isTop: boolean, className?: string }) => {
  return (
    <div 
      className={`absolute w-full overflow-hidden flex justify-center 
        ${isTop ? 'top-0 items-end rounded-t-2xl pb-[1px]' : 'bottom-0 items-start rounded-b-2xl pt-[1px]'} 
        bg-card text-text font-bold leading-none backface-hidden ${className}`}
      style={{ 
        transformOrigin: isTop ? 'bottom' : 'top',
      }}
    >
      <div 
        className="absolute text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] tracking-tighter"
        style={{
          transform: isTop ? 'translateY(50%)' : 'translateY(-50%)'
        }}
      >
        {value}
      </div>
    </div>
  );
};

const FlipUnit = ({ value, title, indicator }: FlipUnitProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentValue) {
      setPreviousValue(currentValue);
      setCurrentValue(value);
      setIsFlipping(true);
      
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 600); // match animation duration
      
      return () => clearTimeout(timer);
    }
  }, [value, currentValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-40 sm:w-48 sm:h-64 md:w-64 md:h-80 lg:w-80 lg:h-96 perspective-1000 shadow-[var(--card-shadow)] rounded-2xl mx-1 sm:mx-2 md:mx-4">
        
        {/* Static Background Bottom */}
        <AnimatedCard value={currentValue} isTop={false} />
        
        {/* Static Background Top (Next value) */}
        <AnimatedCard value={currentValue} isTop={true} />

        {/* Top-left Indicator (AM/PM) */}
        {indicator && (
          <div className="absolute top-4 left-4 z-40 text-text/50 font-bold text-sm sm:text-lg lg:text-xl tracking-wider">
            {indicator}
          </div>
        )}

        {/* Flipping Top Card (Current value falling down) */}
        {isFlipping && (
          <motion.div
            key={`top-${currentValue}`}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-1/2 w-full z-20 preserve-3d"
            style={{ transformOrigin: 'bottom' }}
          >
            <AnimatedCard value={previousValue} isTop={true} className="h-full" />
            <div 
              className="absolute inset-0 bg-black backface-hidden opacity-50 rounded-b-2xl" 
              style={{ transform: 'rotateX(180deg)' }}
            />
          </motion.div>
        )}
        
        {/* Flipping Bottom Card (Next value appearing) */}
        {isFlipping && (
          <motion.div
            key={`bottom-${currentValue}`}
            initial={{ rotateX: 180 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 h-1/2 w-full z-20 preserve-3d"
            style={{ transformOrigin: 'top', backfaceVisibility: 'hidden' }}
          >
             <AnimatedCard value={currentValue} isTop={false} className="h-full" />
          </motion.div>
        )}
        
        {/* Center line separator */}
        <div className="absolute top-1/2 left-0 w-full h-[4px] bg-black/80 z-30 transform -translate-y-1/2" />
      </div>
      
      {title && (
        <span className="mt-4 text-[10px] sm:text-xs tracking-[0.2em] uppercase opacity-50 font-bold">{title}</span>
      )}
    </div>
  );
};

interface FlipClockProps {
  hours: string;
  minutes: string;
  seconds: string;
  ampm?: string;
  showSeconds?: boolean;
}

export const FlipClock = ({ hours, minutes, seconds, ampm, showSeconds = true }: FlipClockProps) => {
  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-8">
      <FlipUnit value={hours} indicator={ampm} title="HOURS" />
      <FlipUnit value={minutes} title="MINUTES" />
      {showSeconds && <FlipUnit value={seconds} title="SECONDS" />}
    </div>
  );
};
