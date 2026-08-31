import { useState, useEffect } from 'react';

export function useTime(is12Hour: boolean) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const formattedHours = is12Hour 
    ? (hours % 12 || 12).toString().padStart(2, '0')
    : hours.toString().padStart(2, '0');
  
  const ampm = is12Hour ? (hours >= 12 ? 'PM' : 'AM') : '';

  return {
    hours: formattedHours,
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    ampm,
    date: time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  };
}
