'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getScores, clearScores, LeaderboardEntry } from '@/lib/storage';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const router = useRouter();
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  const handleClear = () => {
    if (confirm('Clear all leaderboard scores?')) {
      clearScores();
      setScores([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center px-4 py-12"
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-white/50 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          {scores.length > 0 ? (
            <button
              onClick={handleClear}
              className="text-red-400/60 hover:text-red-400 transition-colors text-sm"
            >
              Clear
            </button>
          ) : (
            <span />
          )}
        </div>

        {/* Scores */}
        {scores.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg">No scores yet.</p>
            <p className="text-sm mt-2">Play a quiz and save your score!</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 px-6 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
            >
              Play Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {scores.slice(0, 10).map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  idx === 0
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : idx === 1
                    ? 'bg-slate-400/10 border-slate-400/30'
                    : idx === 2
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-2xl w-8 text-center">
                  {idx < 3 ? MEDAL[idx] : `${idx + 1}`}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">
                    {entry.name}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5 truncate capitalize">
                    {entry.category} · {entry.difficulty} · {entry.date}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-white">
                    {entry.score}/{entry.total}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      entry.pct >= 80
                        ? 'text-green-400'
                        : entry.pct >= 50
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {entry.pct}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
