'use client';

import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  progress: number;
  isUrgent: boolean;
}

export default function Timer({ timeLeft, progress, isUrgent }: TimerProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      animate={isUrgent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={
        isUrgent ? { repeat: Infinity, duration: 0.8, ease: 'easeInOut' } : {}
      }
      className="relative flex items-center justify-center"
    >
      <svg width="72" height="72" className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="5"
        />
        {/* Progress */}
        <motion.circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={isUrgent ? '#ef4444' : progress > 0.5 ? '#a855f7' : '#f59e0b'}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className={`absolute text-lg font-bold tabular-nums ${
          isUrgent ? 'text-red-400' : 'text-white'
        }`}
      >
        {timeLeft}
      </span>
    </motion.div>
  );
}
