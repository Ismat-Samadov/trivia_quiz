'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface QuizCardProps {
  question: string;
  answers: string[];
  selected: string | null;
  correct: string;
  onSelect: (answer: string) => void;
  questionIndex: number;
}

export default function QuizCard({
  question,
  answers,
  selected,
  correct,
  onSelect,
  questionIndex,
}: QuizCardProps) {
  const getButtonStyle = (answer: string) => {
    if (!selected) {
      return 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50 cursor-pointer';
    }
    if (answer === correct) {
      return 'bg-green-500/20 border-green-500 text-green-300';
    }
    if (answer === selected && answer !== correct) {
      return 'bg-red-500/20 border-red-500 text-red-300';
    }
    return 'bg-white/5 border-white/5 text-white/30';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* Question */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 mb-5">
          <p className="text-white text-xl font-medium leading-relaxed text-center">
            {question}
          </p>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {answers.map((answer, idx) => (
            <motion.button
              key={answer}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
              whileHover={!selected ? { scale: 1.01 } : {}}
              whileTap={!selected ? { scale: 0.99 } : {}}
              onClick={() => !selected && onSelect(answer)}
              animate-selected={
                selected === answer && answer === correct
                  ? 'correct'
                  : selected === answer && answer !== correct
                  ? 'wrong'
                  : 'default'
              }
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-200 ${getButtonStyle(answer)}`}
            >
              <span className="opacity-50 mr-3 font-mono">
                {String.fromCharCode(65 + idx)}.
              </span>
              {answer}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
