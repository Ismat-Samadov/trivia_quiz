'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { resumeAudio } from '@/lib/sounds';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'science', label: 'Science' },
  { value: 'computers', label: 'Computers' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'sports', label: 'Sports' },
  { value: 'film', label: 'Film' },
  { value: 'music', label: 'Music' },
  { value: 'math', label: 'Math' },
  { value: 'animals', label: 'Animals' },
  { value: 'art', label: 'Art' },
  { value: 'books', label: 'Books' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'from-green-500 to-emerald-600' },
  { value: 'medium', label: 'Medium', color: 'from-yellow-500 to-orange-500' },
  { value: 'hard', label: 'Hard', color: 'from-red-500 to-rose-600' },
];

const COUNTS = [5, 10, 15];

export default function HomeScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(10);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);

  const handleStart = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    resumeAudio();
    const params = new URLSearchParams({
      category,
      difficulty,
      count: String(count),
      name: name.trim(),
    });
    router.push(`/quiz?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
        className="mb-8 text-center"
      >
        <div className="text-7xl mb-4">🧠</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          TriviaBlitz
        </h1>
        <p className="text-white/50 mt-2 text-lg">Test your knowledge!</p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-6"
      >
        {/* Player Name */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Enter your name..."
            maxLength={30}
            className={`w-full bg-white/10 border ${
              nameError ? 'border-red-500' : 'border-white/20'
            } rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all`}
          />
          {nameError && (
            <p className="text-red-400 text-sm mt-1">Please enter your name</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  category === cat.value
                    ? 'bg-purple-600 text-white border border-purple-400'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Difficulty
          </label>
          <div className="flex gap-3">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setDifficulty(diff.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  difficulty === diff.value
                    ? `bg-gradient-to-r ${diff.color} text-white border-transparent shadow-lg`
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Number of Questions
          </label>
          <div className="flex gap-3">
            {COUNTS.map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  count === c
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-shadow"
        >
          Start Quiz →
        </motion.button>

        {/* Leaderboard Link */}
        <div className="text-center">
          <button
            onClick={() => router.push('/leaderboard')}
            className="text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            View Leaderboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
