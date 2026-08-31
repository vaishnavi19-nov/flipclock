import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer() {
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const endTimeRef = useRef<number | null>(null);

  const start = useCallback((seconds: number) => {
    setInitialSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(true);
    endTimeRef.current = Date.now() + seconds * 1000;
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    endTimeRef.current = null;
  }, []);

  const resume = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsRunning(true);
      endTimeRef.current = Date.now() + remainingSeconds * 1000;
    }
  }, [remainingSeconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(0);
    setInitialSeconds(0);
    endTimeRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (endTimeRef.current) {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
        setRemainingSeconds(timeLeft);

        if (timeLeft <= 0) {
          setIsRunning(false);
          endTimeRef.current = null;
          // Optionally play an alarm sound here
        }
      }
    }, 100); // 100ms interval for precision, state only changes when second changes

    return () => clearInterval(interval);
  }, [isRunning]);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    isRunning,
    isPaused: !isRunning && remainingSeconds > 0 && remainingSeconds < initialSeconds,
    isIdle: !isRunning && remainingSeconds === 0,
    start,
    pause,
    resume,
    reset
  };
}
