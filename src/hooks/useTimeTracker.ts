import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'flipclock_time_tracker_v1';

export interface TimeStats {
  daySeconds: number;
  weekSeconds: number;
  monthSeconds: number;
  yearSeconds: number;
  sessionSeconds: number;
}

const getTodayKey = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekKeys = (d: Date = new Date()): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(d);
    current.setDate(current.getDate() - i);
    keys.push(getTodayKey(current));
  }
  return keys;
};

const getMonthPrefix = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getYearPrefix = (d: Date = new Date()): string => {
  return `${d.getFullYear()}`;
};

export function useTimeTracker(isTracking: boolean = true) {
  const [data, setData] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading time tracker data:', e);
      return {};
    }
  });

  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Tick every second only when tracking is active (e.g. user timer running)
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      const today = getTodayKey();
      
      setSessionSeconds(prev => prev + 1);
      
      setData(prev => {
        const updated = {
          ...prev,
          [today]: (prev[today] || 0) + 1
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error('Error saving time tracker data:', e);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const now = new Date();
  const todayKey = getTodayKey(now);
  const weekKeys = getWeekKeys(now);
  const monthPrefix = getMonthPrefix(now);
  const yearPrefix = getYearPrefix(now);

  const daySeconds = data[todayKey] || 0;
  
  const weekSeconds = weekKeys.reduce((acc, key) => acc + (data[key] || 0), 0);
  
  const monthSeconds = Object.keys(data)
    .filter(key => key.startsWith(monthPrefix))
    .reduce((acc, key) => acc + data[key], 0);

  const yearSeconds = Object.keys(data)
    .filter(key => key.startsWith(yearPrefix))
    .reduce((acc, key) => acc + data[key], 0);

  const resetStats = useCallback(() => {
    setData({});
    setSessionSeconds(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error resetting time tracker data:', e);
    }
  }, []);

  return {
    stats: {
      daySeconds,
      weekSeconds,
      monthSeconds,
      yearSeconds,
      sessionSeconds
    } as TimeStats,
    resetStats
  };
}

export function formatTimeSummary(seconds: number): { main: string; sub: string; rawHours: number } {
  if (seconds <= 0) return { main: '0m', sub: '0 seconds', rawHours: 0 };

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const rawHours = +(seconds / 3600).toFixed(2);

  if (h > 0) {
    return {
      main: `${h}h ${m}m`,
      sub: `${s}s active`,
      rawHours
    };
  }
  if (m > 0) {
    return {
      main: `${m}m ${s}s`,
      sub: `${rawHours} hrs`,
      rawHours
    };
  }
  return {
    main: `${s}s`,
    sub: 'just started',
    rawHours
  };
}
