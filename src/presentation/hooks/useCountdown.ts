// src/presentation/hooks/useCountdown.ts
import { useState, useEffect } from 'react';

export interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export const useCountdown = (targetDateStr: string): TimeLeft => {
  const targetDate = new Date(targetDateStr).getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: false,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true,
        });
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        isExpired: false,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
