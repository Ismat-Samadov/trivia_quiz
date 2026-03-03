'use client';

import { useState, useEffect, useRef } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  progress: number; // 0 to 1, where 1 = full time
  isUrgent: boolean; // true when < 25% time left
}

export function useTimer(
  duration: number,
  onExpire: () => void,
  isActive: boolean
): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) {
      onExpireRef.current();
      return;
    }

    const id = setTimeout(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          onExpireRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearTimeout(id);
  }, [timeLeft, isActive]);

  const progress = duration > 0 ? timeLeft / duration : 0;
  const isUrgent = progress < 0.25;

  return { timeLeft, progress, isUrgent };
}
