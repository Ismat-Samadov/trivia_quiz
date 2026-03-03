'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { fetchQuestions, Question } from '@/lib/api';
import { useTimer } from '@/hooks/useTimer';
import QuizCard from '@/components/QuizCard';
import Timer from '@/components/Timer';
import ProgressBar from '@/components/ProgressBar';
import ResultsScreen from '@/components/ResultsScreen';
import { playCorrect, playWrong, playTick } from '@/lib/sounds';

const DIFFICULTY_TIME: Record<string, number> = {
  easy: 30,
  medium: 20,
  hard: 15,
};

function QuizContent() {
  const params = useSearchParams();
  const router = useRouter();

  const category = params.get('category') ?? 'general';
  const difficulty = params.get('difficulty') ?? 'medium';
  const count = parseInt(params.get('count') ?? '10', 10);
  const playerName = params.get('name') ?? 'Player';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const duration = DIFFICULTY_TIME[difficulty] ?? 20;

  // Load questions
  useEffect(() => {
    fetchQuestions(count, category, difficulty)
      .then((qs) => {
        if (!qs.length) throw new Error('empty');
        setQuestions(qs);
        setLoading(false);
        setTimerActive(true);
      })
      .catch(() => {
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      });
  }, [count, category, difficulty]);

  const advance = useCallback(() => {
    setCurrentIdx((prev) => {
      const next = prev + 1;
      if (next >= questions.length) {
        setDone(true);
        setTimerActive(false);
        return prev;
      }
      setSelected(null);
      setTimerActive(true);
      return next;
    });
  }, [questions.length]);

  const handleExpire = useCallback(() => {
    if (selected !== null) return;
    playWrong();
    setSelected('__timeout__');
    setTimerActive(false);
    advanceTimeout.current = setTimeout(advance, 1500);
  }, [selected, advance]);

  const handleSelect = useCallback(
    (answer: string) => {
      if (selected !== null) return;
      setTimerActive(false);
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
      setSelected(answer);

      const q = questions[currentIdx];
      if (answer === q.correct_answer) {
        setScore((s) => s + 1);
        playCorrect();
      } else {
        playWrong();
      }
      advanceTimeout.current = setTimeout(advance, 1500);
    },
    [selected, questions, currentIdx, advance]
  );

  const { timeLeft, progress, isUrgent } = useTimer(
    duration,
    handleExpire,
    timerActive && !loading && !done
  );

  // Tick sound when urgent
  const prevTimeLeft = useRef(timeLeft);
  useEffect(() => {
    if (isUrgent && timeLeft !== prevTimeLeft.current && timeLeft > 0 && timerActive) {
      playTick();
    }
    prevTimeLeft.current = timeLeft;
  }, [timeLeft, isUrgent, timerActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, []);

  if (done) {
    return (
      <ResultsScreen
        score={score}
        total={questions.length}
        playerName={playerName}
        category={category}
        difficulty={difficulty}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <p className="text-white/50">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const current = questions[currentIdx];
  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center px-4 py-8"
    >
      <div className="w-full max-w-lg space-y-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <ProgressBar
              current={currentIdx + 1}
              total={questions.length}
            />
          </div>
          <Timer
            timeLeft={timeLeft}
            progress={progress}
            isUrgent={isUrgent}
          />
        </div>

        {/* Score Badge */}
        <div className="flex items-center justify-between px-1">
          <span className="text-white/50 text-sm truncate max-w-[160px]">
            {playerName}
          </span>
          <span className="text-sm font-semibold text-white/80">
            Score:{' '}
            <span className="text-purple-400 font-bold">{score}</span>
          </span>
        </div>

        {/* Quiz Card */}
        <QuizCard
          question={current.question}
          answers={current.all_answers}
          selected={selected}
          correct={current.correct_answer}
          onSelect={handleSelect}
          questionIndex={currentIdx}
        />

        {/* Category chip */}
        <div className="text-center">
          <span className="inline-block text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full capitalize">
            {current.category} · {current.difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
