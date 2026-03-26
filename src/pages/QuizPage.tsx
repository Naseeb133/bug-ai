import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { QuizAnswers } from '@/lib/store';

const QUESTIONS = [
  {
    key: 'color' as const,
    question: 'What color is the bug?',
    options: ['Black', 'Brown', 'Green', 'Red / Orange', 'Yellow', 'Multi-colored'],
  },
  {
    key: 'size' as const,
    question: 'Approximate size?',
    options: ['Tiny (< 5mm)', 'Small (5-15mm)', 'Medium (15-30mm)', 'Large (> 30mm)'],
  },
  {
    key: 'features' as const,
    question: 'What features are visible?',
    options: ['Wings', 'Many legs', 'Antennae', 'Shell / Hard body', 'Fuzzy / Hairy', 'Pincers / Stinger'],
  },
  {
    key: 'location' as const,
    question: 'Where did you find it?',
    options: ['Home', 'Garden', 'Forest', 'Hiking trail'],
  },
];

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = (location.state as any)?.imageUrl || '';
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const current = QUESTIONS[step];

  const selectAnswer = (value: string) => {
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      navigate('/analyzing', { state: { imageUrl, quizAnswers: updated as QuizAnswers } });
    }
  };

  return (
    <div className="relative z-10 flex flex-col min-h-[calc(100vh-4rem)] max-w-lg mx-auto px-4 pt-4 pb-20">
      {/* Bug image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-48 rounded-[1.25rem] overflow-hidden glass-card mb-4"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Captured bug" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image captured
          </div>
        )}
      </motion.div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? 'bg-pro-gradient glow-sm' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-xs text-muted-foreground mb-1">Question {step + 1} of {QUESTIONS.length}</p>
          <h2 className="text-xl font-bold mb-5">{current.question}</h2>

          <div className="flex flex-col gap-2.5">
            {current.options.map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => selectAnswer(opt)}
                className={`w-full p-4 rounded-[1.25rem] text-sm font-medium text-left flex items-center justify-between transition-all duration-200 ${
                  answers[current.key] === opt
                    ? 'btn-gradient text-primary-foreground'
                    : 'glass-card hover:border-primary/30'
                }`}
              >
                {opt}
                <ChevronRight size={14} className="opacity-40" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
