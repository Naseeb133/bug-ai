import { useState, useEffect } from 'react';
import { Bug, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SightingRow {
  id: string;
  image_url: string;
  species: string;
  scientific_name: string;
  confidence: number;
  safety: string;
  bite_risk: string;
  ecological_role: string;
  fun_facts: string[];
  removal_tips: string;
  quiz_color: string | null;
  quiz_size: string | null;
  quiz_features: string | null;
  quiz_location: string | null;
  created_at: string;
}

export default function HistoryPage() {
  const [sightings, setSightings] = useState<SightingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase
      .from('sightings')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSightings(data || []);
        setLoading(false);
      });
  }, [user]);

  const handleClick = (s: SightingRow) => {
    navigate('/result', {
      state: {
        sighting: {
          id: s.id,
          imageUrl: s.image_url,
          species: s.species,
          scientificName: s.scientific_name,
          confidence: s.confidence,
          safety: s.safety,
          biteRisk: s.bite_risk,
          ecologicalRole: s.ecological_role,
          funFacts: s.fun_facts,
          removalTips: s.removal_tips,
          quizAnswers: { color: s.quiz_color || '', size: s.quiz_size || '', features: s.quiz_features || '', location: s.quiz_location || '' },
          date: new Date(s.created_at).getTime(),
        },
      },
    });
  };

  return (
    <div className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-20">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">My Sightings</h1>
        <p className="text-sm text-muted-foreground mb-6">Your identified insects</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sightings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Bug size={40} className="opacity-30" />
          <p className="text-sm">No sightings yet</p>
          <p className="text-xs">Identify your first bug to start!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence>
            {sightings.map((s, i) => (
              <motion.button
                key={s.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                exit={{ opacity: 0, x: -100 }}
                onClick={() => handleClick(s)}
                className="glass-card rounded-[1.25rem] p-3 flex items-center gap-3 w-full text-left transition-all hover:border-primary/30"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                  <img src={s.image_url} alt={s.species} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.species}</p>
                  <p className="text-xs text-muted-foreground italic truncate">{s.scientific_name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(s.created_at).toLocaleDateString()} · {s.confidence}% match
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                  s.safety === 'dangerous' || s.safety === 'venomous'
                    ? 'bg-destructive/10 text-destructive'
                    : s.safety === 'pest'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {s.safety}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
