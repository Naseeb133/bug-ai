import { useState, useRef } from 'react';
import { Camera, Upload, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BugLogo from '@/components/BugLogo';
import DrBuzz from '@/components/DrBuzz';
import { getSightings, getDailyUsage, FREE_DAILY_LIMIT, isPro, type Sighting } from '@/lib/store';

export default function Home() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const recent = getSightings().slice(0, 3);

  const handleCapture = () => {
    // Open camera via file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        navigate('/quiz', { state: { imageUrl: url } });
      }
    };
    input.click();
  };

  const handleUpload = () => {
    fileRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      navigate('/quiz', { state: { imageUrl: url } });
    }
  };

  const usage = getDailyUsage();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] max-w-lg mx-auto px-4 pt-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <BugLogo size="sm" />
        {!isPro() && (
          <span className="text-[11px] text-muted-foreground bg-surface px-2.5 py-1 rounded-full">
            {usage}/{FREE_DAILY_LIMIT} free today
          </span>
        )}
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-4 mb-8 ambient-glow">
        <DrBuzz size="lg" />
        <h1 className="text-2xl font-bold">Identify Any Bug Instantly</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          Point your camera at any insect and Dr. Buzz will identify it, check if it's safe, and share fun facts!
        </p>
      </div>

      {/* Camera CTA */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleCapture}
        className="w-full py-5 rounded-2xl bg-pro-gradient text-primary-foreground font-semibold text-base flex items-center justify-center gap-3 glow-lg mb-3"
      >
        <Camera size={22} />
        Point Camera at a Bug
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleUpload}
        className="w-full py-3.5 rounded-2xl bg-surface glow-border text-foreground font-medium text-sm flex items-center justify-center gap-2 mb-8"
      >
        <Upload size={16} />
        Upload from Gallery
      </motion.button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* Recent Sightings */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Recent Sightings</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-primary flex items-center gap-0.5"
            >
              See all <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recent.map((s) => (
              <SightingCard key={s.id} sighting={s} onClick={() => navigate('/result', { state: { sighting: s } })} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SightingCard({ sighting, onClick }: { sighting: Sighting; onClick: () => void }) {
  return (
    <button onClick={onClick} className="shrink-0 w-28 text-left">
      <div className="w-28 h-28 rounded-2xl bg-surface overflow-hidden mb-1.5">
        <img src={sighting.imageUrl} alt={sighting.species} className="w-full h-full object-cover" />
      </div>
      <p className="text-xs font-medium truncate">{sighting.species}</p>
      <p className="text-[10px] text-muted-foreground">{new Date(sighting.date).toLocaleDateString()}</p>
    </button>
  );
}
