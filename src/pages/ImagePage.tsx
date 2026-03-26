import { useState } from 'react';
import { Send, Download, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BugLogo from '@/components/BugLogo';
import TypingIndicator from '@/components/TypingIndicator';
import { getDailyUsage, FREE_DAILY_LIMIT, isPro, incrementUsage } from '@/lib/store';

// Placeholder images for demo
const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1676299081847-824916de030a?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1686191128892-3b37add4a028?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=512&h=512&fit=crop',
];

export default function ImagePage() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    if (!isPro() && getDailyUsage() >= FREE_DAILY_LIMIT) return;

    setPrompt(input);
    setInput('');
    setIsGenerating(true);
    incrementUsage();

    await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));

    setGeneratedImage(DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)]);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <BugLogo size="sm" />
        <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
          <ImagePlus size={12} /> Image Mode
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          {!generatedImage && !isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-4 ambient-glow"
            >
              <div className="w-32 h-32 rounded-3xl bg-surface glow-md flex items-center justify-center">
                <ImagePlus size={48} className="text-primary/50" />
              </div>
              <p className="text-muted-foreground text-sm text-center max-w-xs">
                Describe any image and Bug AI will create it for you.
              </p>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full gap-4"
            >
              <p className="text-sm text-muted-foreground">Creating "{prompt}"…</p>
              <TypingIndicator />
            </motion.div>
          )}

          {generatedImage && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-xs text-muted-foreground text-center">"{prompt}"</p>
              <div className="rounded-2xl overflow-hidden glow-md glow-border">
                <img src={generatedImage} alt={prompt} className="w-full max-w-sm" />
              </div>
              <div className="flex gap-3">
                <a
                  href={generatedImage}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-surface hover:bg-surface-hover rounded-xl px-4 py-2 text-sm transition-colors"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="pb-4 pt-2">
        <div className="flex items-center gap-2 bg-surface rounded-2xl px-4 py-2 glow-border focus-within:glow-sm transition-shadow">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="Describe an image to create…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 transition-opacity"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
