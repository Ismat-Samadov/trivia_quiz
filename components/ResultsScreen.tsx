'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { addScore } from '@/lib/storage';
import { playWin } from '@/lib/sounds';

interface ResultsScreenProps {
  score: number;
  total: number;
  playerName: string;
  category: string;
  difficulty: string;
}

function getStars(pct: number): number {
  if (pct >= 80) return 3;
  if (pct >= 50) return 2;
  return 1;
}

function getRating(pct: number): string {
  if (pct === 100) return 'Perfect! 🎯';
  if (pct >= 80) return 'Excellent! 🌟';
  if (pct >= 60) return 'Great job! 👏';
  if (pct >= 40) return 'Not bad! 👍';
  return 'Keep practicing! 💪';
}

export default function ResultsScreen({
  score,
  total,
  playerName,
  category,
  difficulty,
}: ResultsScreenProps) {
  const router = useRouter();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const stars = getStars(pct);
  const [saved, setSaved] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    playWin();
    // Animate score counter
    let current = 0;
    const step = Math.max(1, Math.floor(score / 20));
    const id = setInterval(() => {
      current = Math.min(current + step, score);
      setDisplayScore(current);
      if (current >= score) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [score]);

  const handleSave = () => {
    addScore({
      name: playerName,
      score,
      total,
      pct,
      category,
      difficulty,
      date: new Date().toLocaleDateString(),
    });
    setSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-white mb-1"
          >
            Quiz Complete!
          </motion.h2>
          <p className="text-white/50">{getRating(pct)}</p>
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
        >
          {/* Stars */}
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3].map((s) => (
              <motion.span
                key={s}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: s <= stars ? 1 : 0.5, rotate: 0 }}
                transition={{ delay: 0.3 + s * 0.15, type: 'spring', bounce: 0.6 }}
                className={`text-4xl ${s <= stars ? 'opacity-100' : 'opacity-20'}`}
              >
                ⭐
              </motion.span>
            ))}
          </div>

          {/* Big Score */}
          <div className="mb-2">
            <span className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {displayScore}
            </span>
            <span className="text-2xl text-white/40">/{total}</span>
          </div>
          <p className="text-white/60 text-xl">{pct}% correct</p>

          {/* Meta */}
          <div className="mt-5 flex justify-center gap-6 text-sm text-white/40">
            <span className="capitalize">{category}</span>
            <span>·</span>
            <span className="capitalize">{difficulty}</span>
            <span>·</span>
            <span>{playerName}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {!saved ? (
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:opacity-90 transition-opacity"
            >
              Save to Leaderboard
            </button>
          ) : (
            <div className="w-full py-3.5 rounded-xl font-semibold bg-green-500/20 border border-green-500/50 text-green-400 text-center">
              ✓ Score saved!
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 rounded-xl font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              Play Again
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="flex-1 py-3 rounded-xl font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              Leaderboard
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
