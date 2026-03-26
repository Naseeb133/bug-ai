import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DrBuzz from '@/components/DrBuzz';
import { identifyBug, generateId, type QuizAnswers, type Sighting, getDailyUsage, FREE_DAILY_LIMIT, isPro, incrementUsage } from '@/lib/store';

const STEPS = [
  'Analyzing patterns…',
  'Comparing species…',
  'Checking safety data…',
  'Preparing results…',
];

export default function AnalyzingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl, quizAnswers } = (location.state as { imageUrl: string; quizAnswers: QuizAnswers }) || {};
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!imageUrl) {
      navigate('/');
      return;
    }

    if (!isPro() && getDailyUsage() >= FREE_DAILY_LIMIT) {
      navigate('/upgrade');
      return;
    }

    incrementUsage();

    const interval = setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          const bugData = identifyBug(quizAnswers);
          const sighting: Sighting = {
            id: generateId(),
            imageUrl,
            ...bugData,
            quizAnswers,
            date: Date.now(),
          };
          setTimeout(() => {
            navigate('/result', { state: { sighting, isNew: true } });
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] max-w-lg mx-auto px-4 ambient-glow">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DrBuzz size="lg" thinking />
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {/* Scanning animation */}
        <div className="relative w-48 h-2 rounded-full overflow-hidden glass-card">
          <motion.div
            className="absolute inset-y-0 left-0 bg-pro-gradient rounded-full"
            animate={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <motion.p
          key={stepIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground"
        >
          {STEPS[stepIdx]}
        </motion.p>
      </div>
    </div>
  );
}
