import { Play, Pause, Square, ChevronUp, ChevronDown } from 'lucide-react';

interface TimerControlsProps {
  hours: number;
  minutes: number;
  seconds: number;
  setHours: (h: number) => void;
  setMinutes: (m: number) => void;
  setSeconds: (s: number) => void;
  isRunning: boolean;
  isPaused?: boolean;
  isIdle: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const TimerControls = ({
  hours, minutes, seconds,
  setHours, setMinutes, setSeconds,
  isRunning, isIdle,
  onStart, onPause, onResume, onReset
}: TimerControlsProps) => {

  const handleAdjust = (type: 'h' | 'm' | 's', amount: number) => {
    if (type === 'h') setHours(Math.max(0, Math.min(99, hours + amount)));
    if (type === 'm') setMinutes(Math.max(0, Math.min(59, minutes + amount)));
    if (type === 's') setSeconds(Math.max(0, Math.min(59, seconds + amount)));
  };

  if (!isIdle) {
    return (
      <div className="mt-12 flex space-x-6 z-20">
        {isRunning ? (
          <button onClick={onPause} className="p-4 rounded-full bg-card shadow-lg border border-divider text-text hover:scale-110 transition-transform">
            <Pause size={24} />
          </button>
        ) : (
          <button onClick={onResume} className="p-4 rounded-full bg-accent shadow-[var(--glow)] text-white hover:scale-110 transition-transform">
            <Play size={24} />
          </button>
        )}
        <button onClick={onReset} className="p-4 rounded-full bg-card shadow-lg border border-divider text-text hover:scale-110 transition-transform">
          <Square size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center space-y-6 z-20">
      <div className="flex space-x-12 opacity-80">
        <div className="flex flex-col items-center space-y-2">
          <button onClick={() => handleAdjust('h', 1)} className="p-2 hover:bg-black/10 rounded-lg transition-colors"><ChevronUp size={20} /></button>
          <span className="font-mono font-bold tracking-widest uppercase text-xs">HRS</span>
          <button onClick={() => handleAdjust('h', -1)} className="p-2 hover:bg-black/10 rounded-lg transition-colors"><ChevronDown size={20} /></button>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <button onClick={() => handleAdjust('m', 1)} className="p-2 hover:bg-black/10 rounded-lg transition-colors"><ChevronUp size={20} /></button>
          <span className="font-mono font-bold tracking-widest uppercase text-xs">MIN</span>
          <button onClick={() => handleAdjust('m', -1)} className="p-2 hover:bg-black/10 rounded-lg transition-colors"><ChevronDown size={20} /></button>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <button onClick={() => handleAdjust('s', 1)} className="p-2 hover:bg-black/10 rounded-lg transition-colors"><ChevronUp size={20} /></button>
          <span className="font-mono font-bold tracking-widest uppercase text-xs">SEC</span>
          <button onClick={() => handleAdjust('s', -1)} className="p-2 hover:bg-black/10 rounded-lg transition-colors"><ChevronDown size={20} /></button>
        </div>
      </div>
      
      <button 
        onClick={onStart}
        disabled={hours === 0 && minutes === 0 && seconds === 0}
        className="px-8 py-3 rounded-full bg-accent shadow-[var(--glow)] text-white font-bold tracking-widest uppercase text-sm hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
      >
        Start Timer
      </button>
    </div>
  );
};
